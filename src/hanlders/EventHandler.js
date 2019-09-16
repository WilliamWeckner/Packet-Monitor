const fs = require("fs");
const path = require('path')


module.exports = (app, win, BrowserWindow) => {
    fs.readdir(path.join(__dirname,"../events"), (err, files) => {
        if (err) return console.log(err)

        files.forEach(file => {
            if (!file.endsWith(".js")) return

            const event = require(`../events/${file}`);
            let eventName = file.split('.')[0]


            app.on(eventName, event.bind(null, app,win,BrowserWindow))
        })
        console.log(`Loaded ${files.length} Events`)
    })
}