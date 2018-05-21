import { app, BrowserWindow, shell, screen, ipcMain, remote, ipcRenderer } from 'electron';
import * as url from 'url';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';


const PDFWindow = require('electron-pdf-window')
const autoUpdater = require('electron-updater').autoUpdater;
const log = require('electron-log');
// const printer = require('printer');

const qs = require('querystring');

//const pdfURL = "http://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";

const convertFactory = require('electron-html-to');

const conversion = convertFactory({
  converterPath: convertFactory.converters.PDF
});

let win, serve, updatemessage, print_Preview, print_Preview2, canvasPrint, data_to_print, pdfPath, param;
let printerlist;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

pdfPath = path.join(os.tmpdir(), 'print.pdf');
if (serve) {
  require('electron-reload')(__dirname, {
  });
}

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    backgroundColor: '#2e2c29',
    autoHideMenuBar: true,
  });

  // and load the index.html of the app.
  win.loadURL(url.format({
    protocol: 'file:',
    pathname: path.join(__dirname, '/index.html'),
    slashes: true
  }));

  // Open the DevTools.
  if (serve) {
    win.webContents.openDevTools();
  }
 //  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', function () {
    createWindow();
    createPrintPreview();
    createCanvasPrint();
    //createPrintPreview2();
    //printerlist = printer.getPrinters();

    // param = qs.stringify({ file: pdfPath });
    // createPrintPreview2();

  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();

    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
log.info('App starting...');

function sendStatusToWindow(text) {
  log.info(text);
  updatemessage = text;
  win.webContents.send('message', updatemessage);
}


autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});
autoUpdater.on('update-available', (ev, info) => {
  sendStatusToWindow('update-available');
  setTimeout(function () {
    win.webContents.send('update_info',
      'A new version has been downloaded. Restart the application to apply the updates.' +
      '<br> <button type="button" class="btn btn-success" (click)="click_update()">Success</button> <button>Later</button>');
  }, 5000);
});
autoUpdater.on('update-not-available', (ev, info) => {
  sendStatusToWindow('Update not available.');
});
autoUpdater.on('error', (ev, err) => {
  sendStatusToWindow(err);
});
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
  sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', (ev, info) => {
  sendStatusToWindow(info);
  autoUpdater.quitAndInstall();
});

ipcMain.on('check-update-app', function () {
  autoUpdater.checkForUpdates();
});

// get app current version

ipcMain.on('getversion', function (event) {
  event.sender.send('version', app.getVersion());
});


// print
function createPrintPreview() {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  const bounds = electronScreen.getPrimaryDisplay().bounds;

  const WINDOW_WIDTH = size.width - 50;
  const WINDOW_HEIGHT = size.height;

  let x = Math.ceil(bounds.x + ((bounds.width - WINDOW_WIDTH) / 2));
  let y = Math.ceil(bounds.y + ((bounds.height - WINDOW_HEIGHT) / 2));

  print_Preview = new BrowserWindow({
    x: x,
    y: y,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    show: false,
    parent: win,
    modal: true,
    autoHideMenuBar: true,
    //frame: false
    transparent: true
  });

  print_Preview.on('closed', () => {
    print_Preview = null;
  })

  PDFWindow.addSupport(print_Preview)

}
function createPrintPreview2() {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  const bounds = electronScreen.getPrimaryDisplay().bounds;

  const WINDOW_WIDTH = size.width - 85;
  const WINDOW_HEIGHT = size.height - 75;

  let x = Math.ceil(bounds.x + ((bounds.width - WINDOW_WIDTH) / 2));
  let y = Math.ceil(bounds.y + ((bounds.height - WINDOW_HEIGHT) / 2));
  print_Preview2 = new BrowserWindow({
    x: x,
    y: y,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    show: false,
    // parent: win,
    modal: true,
    // frame: false,
    //transparent: true,
    webPreferences: { plugins: true },
    resizable: false
  });


  /* print_Preview2.loadURL(url.format({
     pathname: path.join(__dirname, '/assets/data/pdfjs/web/viewer.html'),
     protocol: 'file:',
     slashes: true,
 
   })); */

  print_Preview2.loadURL('file://' + __dirname + '/assets/data/pdfjs/web/viewer.html?' + param);

  //print_Preview2.webContents.openDevTools();

  print_Preview2.on('closed', function (event) {
    print_Preview2 = null;
  })

}

function createCanvasPrint() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  const bounds = electronScreen.getPrimaryDisplay().bounds;

  const WINDOW_WIDTH = size.width - 85;
  const WINDOW_HEIGHT = size.height - 75;

  let x = Math.ceil(bounds.x + ((bounds.width - WINDOW_WIDTH) / 2));
  let y = Math.ceil(bounds.y + ((bounds.height - WINDOW_HEIGHT) / 2));

  canvasPrint = new BrowserWindow({
    x: x,
    y: y,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    show: false,
     parent: win,
    modal: true,
    webPreferences: { plugins: true },
    frame: false,
    resizable: false
  });

  canvasPrint.loadURL(url.format({
    pathname: path.join(__dirname, '/assets/data/dataprint.html'),
    protocol: 'file:',
    slashes: true,

  }));

  /*canvasPrint.on('closed', function (event) {
    canvasPrint = null;
  })*/

 // canvasPrint.webContents.openDevTools();

  console.log('do printing.....');
}

ipcMain.on('print', function (event, data) {
  data_to_print = data;
  console.log(data);
  createPrintPreview();
  print_Preview.show();
  console.log(event);
});
/*
ipcMain.on('prosesdata', function (event, x) {
  createPrintPreview();

  console.log('data from client : ', x);
  event.sender.send('previewdata', x);
  const dataprint = x;
  pdfPath = path.join(os.tmpdir(), 'print.pdf');

  print_Preview.webContents.printToPDF({}, function (error, data) {
    if (error) throw error
    fs.writeFile(pdfPath, data, function (err) {
      if (error) {
        throw err
      }
      shell.openItem(pdfPath);
    });
  });

  console.log(pdfPath);
  //PDFWindow.addSupport(win);

  //win.loadURL(pdfPath);
}); */


const options = {
  'paper': 'A4',
  'layout': 'portrait'
};

ipcMain.on('get_printer_list', () => {
  printerlist = win.webContents.getPrinters();
  console.log(printerlist);
  win.webContents.send('printer_list', printerlist);
})



ipcMain.on('on-close-preview', () => {
  // print_Preview2.hide();
  canvasPrint.hide();
})


ipcMain.on('open-pdf-preview', (event, content) => {
  print_Preview2.show();
})

ipcMain.on('open-print-preview', (event, content) => {
  // print_Preview.webContents.send('fill-PrintTo-PDF', content);
  //const data = { 'content': content, 'options': options }
  console.log(content)
  canvasPrint.webContents.send('fill-PrintTo-PDF', content);
  canvasPrint.show();

})

ipcMain.on('open-print-preview2', (event, content) => {
  // pdfPath = path.join(os.tmpdir(), 'print.pdf');
  // print_Preview.show();
  // print_Preview.webContents.send('fillpath', pdfPath);
})

ipcMain.on('print', () => {
  if (print_Preview === null) {
    createPrintPreview();
  }
  print_Preview.loadURL(pdfPath);
  print_Preview.show();
})

ipcMain.on('direct_to_print', (e,data) => {
  win.webContents.print({
    silent: data.silent,
    printBackground: data.printBackground,
    deviceName: data.deviceName,
    pageSize : 'A4',
    landscape : true

  });
})


ipcMain.on('directtoPrint', (event, content) => {
  print_Preview.webContents.send('fill-direct-toPrint', content);
});


ipcMain.on('createPDF2', (event) => {
  pdfPath = path.join(os.tmpdir(), 'print.pdf');
  conversion({ html: '<h1>Hello World</h1>' }, function (err, result) {
    if (err) {
      return console.error(err);
    }

    console.log(result.numberOfPages);
    console.log(result.logs);
    result.stream.pipe(fs.createWriteStream(pdfPath));
    conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
  });
});

// when worker window is ready
ipcMain.on('createPDF', (event) => {
  // pdfPath = path.join(__dirname, './assets/data/pdfjs/web/print.pdf');
  pdfPath = path.join(os.tmpdir(), 'print.pdf');
  // pdfPath = path.join(__dirname, 'print.pdf')
  // Use default printing options
  console.log(canvasPrint.webContents.getPrinters());
  canvasPrint.webContents.printToPDF({
    marginsType: 0,
    printBackground: false,
    printSelectionOnly: false,
    landscape: false,
    headerFooterEnabled: true,
  },
    function (error, data) {
      console.log(data)
      // tslint:disable-next-line:curly
      if (error) throw error
      fs.writeFile(pdfPath, data, function (error) {
        if (error) {
          throw error
        }
        // shell.openItem(pdfPath)
        // event.sender.send('wrote-pdf', pdfPath)
        /*    pdfPath = path.join(os.tmpdir(), 'print.pdf');

              if (print_Preview === null) {
                createPrintPreview();
              }
              print_Preview.loadURL(pdfPath);
              print_Preview.show();
    */
        setTimeout(() => {
          //  const content = { 'file': pdfPath, 'options': printerlist }
          // print_Preview2.webContents.send('fillpath', content);
          //param = qs.stringify({file: pdfPath});
          //createPrintPreview2();

          param = qs.stringify({ file: pdfPath });
          if (print_Preview2 === null) {
            createPrintPreview2();
          }
          createPrintPreview2();
          print_Preview2.show();


        }, 500);

      });
    });
});

ipcMain.on('set-paper-conf', (event, data) => {
  options.layout = data.layout;
  options.paper = data.paper;
  canvasPrint.webContents.send('change-page-conf', options);
})

ipcMain.on('req-page-conf', (e, data) => {
  print_Preview2.webContents.send('get-option', options);
})



ipcMain.on('readyToPrint', () => {
  canvasPrint.webContents.print({
    printBackground: true,
    pageSize: 'A4'
  });
})

ipcMain.on('data_json', (e, data) => {
  canvasPrint.webContents.send('get_json_data', data);
})
