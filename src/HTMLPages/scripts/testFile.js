const { ipcRenderer, session } = require('electron')
const si = require('systeminformation');


const DefaultSettings = {
    interface: "Wi-Fi",
    precision: 3,
    bitrate: "MB"
}

const FakeDatabase = {
    uploadBytes: 0,
    downloadBytes: 0
}


function update_data() {
    setInterval(function updateRandom() {
        si.networkStats("*").then(data => {
            data.forEach(int => {
                if (DefaultSettings.interface == int.iface) {
                    document.getElementById("download-card").innerHTML = `${formatBytes(int.rx_sec, DefaultSettings.precision, DefaultSettings.bitrate)}`
                    document.getElementById("upload-card").innerHTML = `${formatBytes(int.tx_sec, DefaultSettings.precision, DefaultSettings.bitrate)}`
                }
            })
        })
    }, 1000)

}


// let cookie = session.cookies
// console.log(cookie.get("DefaultSettings"))


// ipcRenderer.on('update-Data', (event, data, tray) => {
//     data.forEach(int => {
//         if (DefaultSettings.interface == int.iface) {
//             document.getElementById("error-text").className = " "
//             document.getElementById("error-text").innerHTML = ""

//             document.getElementById("interface").innerHTML = int.iface
//             document.getElementById("selectedINF").innerHTML = int.iface

//             //DataBase
//             FakeDatabase.downloadBytes += int.rx_sec
//             FakeDatabase.uploadBytes += int.tx_sec

//             //Downlaod
//             document.getElementById("download-number").innerHTML = `${formatBytes(int.rx_sec, DefaultSettings.precision, DefaultSettings.bitrate)}`
//             document.getElementById("total-download-number").innerHTML = `${formatBytes(FakeDatabase.downloadBytes, DefaultSettings.precision, DefaultSettings.bitrate)}`

//             //Upload
//             document.getElementById("upload-number").innerHTML = `${formatBytes(int.tx_sec, DefaultSettings.precision, DefaultSettings.bitrate)}`
//             document.getElementById("total-upload-number").innerHTML = `${formatBytes(FakeDatabase.uploadBytes, DefaultSettings.precision, DefaultSettings.bitrate)}`

//         }
//     })
//     interfaces()
// })


function formatBytes(bytes, decimals = 3, size = "MB") {
    var k = 1024
    var dm = decimals > 3 ? 3 : decimals
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    var i = Math.floor(Math.log(bytes) / Math.log(k)) // Auto

    let sizeNumber = size == "Auto" ? i : sizes.indexOf(size)
    return (bytes / Math.pow(k, sizeNumber)).toFixed(dm) + `${sizes[sizeNumber]}/s`;
}

//interfaces loading
function interfaces() {
    var select = document.getElementById('interfaces');
    var selectChilds = select.children

    si.networkInterfaces().then(data => {
        data.forEach(async network => {

            for (let index = 0; index < selectChilds.length; index++) {
                if (selectChilds[index].value == network.iface) return
            }

            var option = document.createElement('option');
            option.value = network.iface
            option.innerHTML = network.ifaceName;

            select.appendChild(option);
        })
    })
}

//HTML Functions for Selections
function precision(value) {
    if (isNaN(value) == true) return
    DefaultSettings.precision = value
}

function interface(value) {
    if (value == "Interface") return
    DefaultSettings.interface = value
}
