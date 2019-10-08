export default function formatBytes(bytes, decimals = 1, size = "MB") {
    var k = 1024
    var dm = decimals > 3 ? 3 : decimals
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    var i = Math.floor(Math.log(bytes) / Math.log(k)) // Auto

    let sizeNumber = size === "Auto" ? i : sizes.indexOf(size)
    if (bytes === 0) return 0 + `${sizes[sizeNumber]}`
    return (bytes / Math.pow(k, sizeNumber)).toFixed(dm) + `${sizes[sizeNumber]}`;
}