"use strict";

const {BrowserWindow, Menu, app} = require("electron");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, splashWindow, pythonServerProcess;

const log = function log(msg) {
    console.log(msg);
};

function createWindow(mainAddr) {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 1200,
        minWidth: 1152,
        minHeight: 864,
        webPreferences: {nodeIntegration: true},
        title: "AIGAR",
        show: false,
    });
    mainWindow.maximize();

    setTimeout(function () {
        log("loading: " + mainAddr);
        mainWindow.loadURL(mainAddr);
    }, 2500);
    /*
    Este código se usaba para evitar el problema de reusar código antiguo en nuevas
    versiones de la aplicación. Modificando la versión en package no debería suceder
    En las actuales se usa para recargar aigar_config
    */
    /*
    mainWindow.loadURL(mainAddr, {"extraHeaders" : "pragma: no-cache\n"});
    mainWindow.webContents.reloadIgnoringCache();
    */
    mainWindow.webContents.session.clearCache(function () {
        log("Cache cleared");
    });
    mainWindow.webContents.session.clearStorageData(function () {
        log("StorageData cleared");
    });

    if (process.platform === "linux") {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.webContents.once("did-finish-load", function () {
        mainWindow.show();
        splashWindow.close();
    });

    /*
  mainWindow.on('close', function() {
    mainWindow.webContents.session.clearCache(function(){log('Closed: Cache cleared')});
    mainWindow.webContents.session.clearStorageData(function(){log('Closed: StorageData cleared')});
  });
*/

    mainWindow.on("closed", function () {
        mainWindow = null;
        pythonServerProcess.kill("SIGINT");
    });
}

// process.on('uncaughtException', function(err){
//   log(err);
//   for (i in err) {
//     log(err[i]);
//   }
// });

app.on("ready", function () {
    // log(app.getPath('userData'));
    Menu.setApplicationMenu(null);

    showSplash();
    log("on ready");
    var spawn = require("child_process").spawn;
    if (process.platform !== "linux") {
        log("not linux");
        pythonServerProcess = spawn("./Python311/python.exe", [
            "./Python311/Lib/site-packages/aigar/manage.py",
            "runserver",
            "--noreload",
            "--nothreading",
        ]);
    } else {
        log("is linux");
        pythonServerProcess = spawn("./Python311/python.exe", [
            "./Python311/Lib/site-packages/aigar/manage.py",
            "runserver",
            "--noreload",
            "--nothreading",
        ]);
    }

    // TODO. Esto está hecho para esperar a que se lance el servidor Python.
    // Sería mejor que fuera una especie de callback que creara la ventana justo
    // después de que el servidor arrancase
    setTimeout(function () {
        var mainAddr = "http://localhost:8000";
        createWindow(mainAddr);
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
    splashWindow.on("closed", function () {
        splashWindow = null;
    });
    splashWindow.loadURL("file://" + __dirname + "/splash.html");
}

// Quit when all windows are closed.
app.on("window-all-closed", function () {
    log("window-all-closed");
    app.quit();
});

app.on("will-quit", function () {
    log("will-quit");
    if (pythonServerProcess) {
        log("Sending SIGTERM");
        pythonServerProcess.kill("SIGTERM");
    }
});

app.on("quit", function () {
    log("quit");
    if (pythonServerProcess) {
        log("Sending SIGKILL");
        pythonServerProcess.kill("SIGKILL");
    }
});

app.on("activate", function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        log("This should not happen");
        createWindow();
    }
});
