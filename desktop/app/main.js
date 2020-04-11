"use strict";

const {BrowserWindow, Menu, app} = require("electron");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, splashWindow;

function createWindow(mainAddr, subpy) {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 1200,
        minWidth: 1152,
        minHeight: 864,
        webPreferences: {nodeIntegration: true},
        title: "AIGAR",
        show: false,
        icon: __dirname + "/window_icon.ico",
    });
    mainWindow.maximize();

    setTimeout(function() {
        mainWindow.loadURL(mainAddr);
    }, 2500);
    /*
    Este código se usaba para evitar el problema de reusar código antiguo en nuevas
    versiones de la aplicación. Modificando la versión en package no debería suceder
  */
    /*
  mainWindow.loadURL(mainAddr, {"extraHeaders" : "pragma: no-cache\n"});
  mainWindow.webContents.reloadIgnoringCache();
  mainWindow.webContents.session.clearCache(function(){console.log('Cache cleared')});
  mainWindow.webContents.session.clearStorageData(function(){console.log('StorageData cleared')});
  */

    // mainWindow.webContents.openDevTools();

    mainWindow.webContents.once("did-finish-load", function() {
        mainWindow.show();
        splashWindow.close();
    });

    /*
  mainWindow.on('close', function() {
    mainWindow.webContents.session.clearCache(function(){console.log('Closed: Cache cleared')});
    mainWindow.webContents.session.clearStorageData(function(){console.log('Closed: StorageData cleared')});
  });
*/

    mainWindow.on("closed", function() {
        mainWindow = null;
        subpy.kill("SIGINT");
    });
}

// process.on('uncaughtException', function(err){
//   console.log(err);
//   for (i in err) {
//     console.log(err[i]);
//   }
// });

app.on("ready", function() {
    // console.log(app.getPath('userData'));
    Menu.setApplicationMenu(null);

    showSplash();

    var spawn = require("child_process").spawn;
    var subpy = spawn("./Python37/python.exe", ["./src/manage.py", "runserver_plus"]);

    // TODO. Esto está hecho para esperar a que se lance el servidor Python.
    // Sería mejor que fuera una especie de callback que creara la ventana justo
    // después de que el servidor arrancase
    setTimeout(function() {
        var mainAddr = "http://localhost:8000";
        createWindow(mainAddr, subpy);
    }, 4000);
});

function showSplash() {
    splashWindow = new BrowserWindow({
        useContentSize: true,
        width: 400,
        height: 400,
        center: true,
        frame: false,
        type: "splash",
    });
    splashWindow.on("closed", function() {
        splashWindow = null;
    });
    splashWindow.loadURL("file://" + __dirname + "/splash.html");
}

// Quit when all windows are closed.
app.on("window-all-closed", function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        console.log("This should not happen");
        createWindow();
    }
});
