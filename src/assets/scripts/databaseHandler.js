const Datastore = window.require('nedb')
const path = window.require('path')

const moment = window.require('moment')
const { remote } = window.require('electron')

let DatabasePath = localStorage.getItem('DatabasePath')
    ? path.join(localStorage.getItem('DatabasePath'), "packetMonitor.db")
    : `${path.join(remote.app.getPath('userData'), "packetMonitor.db")}`

let nedb = new Datastore({ filename: DatabasePath, autoload: true });

class database {
    static getData() {
        return new Promise((res, rej) => {
            nedb.find({}, function (err, docs) {
                if (err) rej(err)
                if (docs.length) res(docs)
                else rej("no_docs_found")
            });
        })
    }


    static setData(sent, recv) {
        return new Promise(function (res, rej) {

            var Schema = {
                _id: moment().format("DD/MM/Y"),
                packets: {
                    sent: sent,
                    recv: recv
                },
                interface: ""
            }

            nedb.find({ _id: moment().format("DD/MM/Y") }, function (err, docs) {
                if (err) rej(err)
                if (!docs || !docs.length) {

                    nedb.insert(Schema, function (err, newDoc) {
                        if (err) return rej(err)
                        if (newDoc.length) res()
                    });
                } else {
                    nedb.update({ _id: moment().format("DD/MM/Y") }, Schema, function (err, numRemplaced) {
                        if (err) return rej(err)
                        res(numRemplaced)
                    })
                }
            });
        })
    }

    static importSQLite(path) {
        return new Promise(function (res, rej) {
            try {
                const db = window.require('better-sqlite3')(path)
                let rows = db.prepare(`SELECT * FROM traffic`).all()

                rows.foreach(function (data) {
                    if ((data.m === null)) return
                    let date = moment(`${data.m} ${data.d} ${data.y}`).format("DD/MM/Y")
                    var Schema = {
                        _id: date,
                        packets: {
                            sent: data.sent,
                            recv: data.recv
                        },
                        interface: ""
                    }

                    nedb.find({ _id: date }, function (err, docs) {
                        if (err) rej(err)

                        if (!docs || !docs.length) {
                            nedb.insert(Schema, function (err, newDoc) {
                                if (err) rej(err)
                                res()
                            });
                        } else {
                            nedb.update({ _id: moment().format("DD/MM/Y") }, Schema, function (err, numRemplaced) {
                                if (err) rej(err)
                                res()
                            })
                        }
                    });

                    return
                })
            } catch (error) {
                rej(error)
            }

        })
    }
}


export default database