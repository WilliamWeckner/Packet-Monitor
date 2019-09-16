const { ipcRenderer, session } = require('electron')
const si = require('systeminformation');

const DefaultSettings = {
    interface: "Wi-Fi",
    precision: 3,
    bitrate: "MB"
}



function update_data() {
    setInterval(function updateRandom() {
        si.networkStats("*").then(data => {
            data.forEach(int => {
                if (DefaultSettings.interface == int.iface) {
                    document.getElementById("download-number").innerHTML = `${formatBytes(int.rx_sec, DefaultSettings.precision, DefaultSettings.bitrate)}`
                    document.getElementById("upload-number").innerHTML = `${formatBytes(int.tx_sec, DefaultSettings.precision, DefaultSettings.bitrate)}`
                }
            })
        })
    }, 1000)

}


function formatBytes(bytes, decimals = 3, size = "MB") {
    var k = 1024
    var dm = decimals > 3 ? 3 : decimals
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    var i = Math.floor(Math.log(bytes) / Math.log(k)) // Auto

    let sizeNumber = size == "Auto" ? i : sizes.indexOf(size)
    return (bytes / Math.pow(k, sizeNumber)).toFixed(dm) + `${sizes[sizeNumber]}/s`;
}