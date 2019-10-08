var Datastore = window.require('nedb')

const moment = window.require('moment')

var nedb = new Datastore({ filename: './elecData.db', autoload: true });


export function getData() {
    return new Promise((res, rej) => {
        nedb.find({ _id: { $gte: `01/${moment().format("MM/Y")}` } }, function (err, docs) {
            if (err) rej(err)
            if (docs.length) res(docs)
            else rej("no_docs_found")
        });
    })
}

export function setData(sent, recv) {
    return new Promise((res, rej) => {

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


// export function importSQLite(params) {
//     const db = window.require('better-sqlite3')('./data.db');
//     let rows = db.prepare(`SELECT * FROM traffic`).all()


//     rows.map(data => {
//         if ((data.m === null)) return
//         let date = moment(`${data.m} ${data.d} ${data.y}`).format("DD/MM/Y")

//         var Schema = {
//             _id: date,
//             packets: {
//                 sent: data.sent,
//                 recv: data.recv
//             },
//             interface: ""
//         }

//         nedb.find({ _id: date }, function (err, docs) {
//             if (err) console.log(err)

//             if (!docs || !docs.length) {
//                 nedb.insert(Schema, function (err, newDoc) {
//                     if (err) console.log(err)

//                     console.log("Inserted")
//                 });
//             } else {
//                 nedb.update({ _id: moment().format("DD/MM/Y") }, Schema, function (err, numRemplaced) {
//                     if (err) console.log(err)

//                     console.log(numRemplaced)
//                 })
//             }
//         });
//     })
// }


