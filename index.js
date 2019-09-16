const path = require("path")

const { app, BrowserWindow, Menu, Tray, globalShortcut } = require('electron')
const si = require('systeminformation');

require('electron-reload')(__dirname)

//Create the main window & Start the handlers
let windows = {
    index: null,
    monitor: null
}
let tray = null

require('./src/hanlders/EventHandler.js')(app, [windows.index], BrowserWindow)


app.on('ready', () => {
    // Create the browser window.
    tray = new Tray("./favicon.ico")

    windows.index = new BrowserWindow({
        width: 1250,
        height: 675,
        center: true,
        resizable: true,
        frame: true,
        transparent: false,
        webPreferences: {
            nodeIntegration: true
        },
    })


    windows.index.loadFile('./src/HTMLPages/index.html')
    windows.index.setMenu(null)
    windows.index.webContents.openDevTools()

    //why not
    startTray()

    // Events
    windows.index.on('close', (event) => {
        if (!app.isQuiting) {
            event.preventDefault();
            windows.index.hide();
        }
        return false;
    });

    windows.index.on('minimize', function (event) {
        event.preventDefault();
        windows.index.hide();
    });



})


function monitorWindow() {
    if (!windows.monitor) {
        windows.monitor = new BrowserWindow({
            height: 40,
            width: 200,
            frame: false,
            resizable: false,
            transparent: true,
            webPreferences: {
                nodeIntegration: true
            },
            skipTaskbar: true
        });


        windows.monitor.loadFile('./src/HTMLPages/monitor.html')

    } else {
        windows.monitor.show()
    }
}


function startTray() {
    tray.setToolTip('Network Monitor')
    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: 'Show App', click: function () {
                windows.index.show();
            }
        },
        {
            label: 'Quit', click: function () {
                win = null;
            }
        },
        {
            label: 'Show Monitor', click: function () {
                monitorWindow()
            }
        },
        {
            label: 'Enable Monitor Click Through', click: function () {
                monitorwindows.index.setIgnoreMouseEvents(true);
            }
        },
        {
            label: 'Disable Monitor Click Through', click: function () {
                monitorwindows.index.setIgnoreMouseEvents(false);
            }
        },
        {
            label: 'Enable Always on Top', click: function () {
                monitorwindows.index.setAlwaysOnTop(true);
            }
        },
        {
            label: 'Disable Always on Top', click: function () {
                monitorwindows.index.setAlwaysOnTop(false);
            }
        }
    ]))

    tray.on("click", () => {

    })
}
