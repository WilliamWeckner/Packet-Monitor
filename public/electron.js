const electron = require('electron')
const { app, BrowserWindow, Tray, Menu, ipcMain } = electron
const isDev = require("electron-is-dev");
const path = require('path')
const url = require('url')

const si = require('systeminformation');

let mainWindow
let tray

if (isDev) {
    process.env.ELECTRON_START_URL = `http://localhost:3000`
}

app.on("ready", () => {
    startElectron()
    startTray()


    setInterval(function () {
        si.networkStats().then(data => {
            mainWindow.send('update_data', data)
        }).catch(err => console.log(err))
    }, 1000)
})


function startTray() {
    tray = new Tray(path.join(__dirname, "favicon.ico"))

    tray.setToolTip('Network Monitor')

    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: 'Ayaya', click: function () {

            }
        },

        {
            label: "Window Position",
            submenu: [
                {
                    label: "Center", click: function () {

                        mainWindow.center()
                        mainWindow.setSize(400, 675)
                    }
                },
                {
                    label: "Reset to Default", click: function () {
                        let displays = electron.screen.getAllDisplays()

                        let posX = displays[0].bounds.width - 400
                        let posY = displays[0].bounds.height - 670

                        mainWindow.setPosition(posX, posY)
                        mainWindow.setSize(400, 675)
                    }
                }
            ]
        }

    ]))

    tray.on("click", () => {
        mainWindow.show()
    })
}

function startElectron() {
    let displays = electron.screen.getAllDisplays()

    let posX = displays[0].bounds.width - 400
    let posY = displays[0].bounds.height - 670

    mainWindow = new BrowserWindow({
        width: 400,
        height: 675,
        alwaysOnTop: true,
        resizable: false,

        webPreferences: {
            nodeIntegration: true,
        },
    })

    mainWindow.setMinimumSize(400, 620)
    mainWindow.setPosition(posX, posY)
    // mainWindow.setMenu(null)

    mainWindow.loadURL(
        url.format(process.env.ELECTRON_START_URL || {
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
        })
    )


    mainWindow.on('close', () => {
        mainWindow = null;

    })

    mainWindow.on('minimize', () => {
        mainWindow.hide()

    })


}
