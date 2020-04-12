const { app, BrowserWindow, webFrame, Menu, dialog } = require('electron')
const path = require('path')
const url = require('url')
const ipc = require('electron').ipcMain

var blessed = require('blessed');

var screen = blessed.screen({
	smartCSR: true
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
	return process.exit(0);
});

var highlightColor = '#00ffff'

var box = blessed.box({
	top: 'center',
	left: 'center',
	width: 60,
	height: 8,
	//tags: true,
});

screen.append(box);

boxes = {}

function channel(id, x, y) {
	var l = x * 18;
	i = blessed.box({width: 1, top: y, left: l + 0, fg: highlightColor})
	e = blessed.box({width: 4, top: y, left: l + 2})
	o = blessed.box({width: 4, top: y, left: l + 7})
	w = blessed.box({width: 4, top: y, left: l + 12})

	i.setContent('0123456789ABCDEF'[id])
	e.setContent("0000")
	o.setContent("????")
	w.setContent("----")

	box.append(i)
	box.append(e)
	box.append(o)
	box.append(w)

	boxes[id] = {'env': e, 'osc': o, 'wav': w}
}

function effect(name, x, y) {
	var l = 2 * 18 + 12 * x;
	i = blessed.box({width: 3, top: y, left: l + 0, fg: highlightColor})
	v = blessed.box({width: 2, top: y, left: l + 4})
	w = blessed.box({width: 4, top: y, left: l + 7})

	i.setContent(name.toUpperCase())
	v.setContent("  ")
	w.setContent("----")

	box.append(i)
	box.append(v)
	box.append(w)

	boxes[name] = {'val': v, 'wav': w}
}

channel( 0, 0, 0)
channel( 1, 0, 1)
channel( 2, 0, 2)
channel( 3, 0, 3)
channel( 4, 0, 4)
channel( 5, 0, 5)
channel( 6, 0, 6)
channel( 7, 0, 7)

channel( 8, 1, 0)
channel( 9, 1, 1)
channel(10, 1, 2)
channel(11, 1, 3)
channel(12, 1, 4)
channel(13, 1, 5)
channel(14, 1, 6)
channel(15, 1, 7)

effect('bit', 0, 0)
effect('dis', 0, 1)
effect('wah', 0, 2)
effect('che', 0, 3)
effect('fee', 0, 4)
effect('del', 0, 5)
effect('tre', 0, 6)
effect('rev', 0, 7)

effect('pha', 1, 0)
effect('vib', 1, 1)
effect('cho', 1, 2)
effect('ste', 1, 3)
effect('equ', 1, 4)
effect('com', 1, 5)
effect('vol', 1, 6)
effect('lim', 1, 7)

ipc.on('channel', function(event, data){
	boxes[data.id][data.col].setContent(data.text.toUpperCase());
	screen.render()
});

ipc.on('effect', function(event, data){
	boxes[data.id]['val'].setContent(data.text.toUpperCase());
	screen.render()
});

ipc.on('activity', function(event, data){
	var glyphs = "@#%=*-";
	var g = glyphs[parseInt(data.activity * glyphs.length)];
	if (g == undefined) g = '-';
	boxes[data.id]['wav'].setContent(g + "---");
	screen.render()
});

screen.render();


let isShown = true

require('electron').protocol.registerSchemesAsPrivileged([
  { scheme: 'js', privileges: { standard: true, secure: true } }
])

function protocolHandler (request, respond) {
  try {
    let pathname = request.url.replace(/^js:\/*/, '')
    let filename = path.resolve(app.getAppPath(), pathname)
    respond({ mimeType: 'text/javascript', data: require('fs').readFileSync(filename) })
  } catch (e) {
    console.error(e, request)
  }
}

app.on('ready', () => {
  require('electron').protocol.registerBufferProtocol('js', protocolHandler)

  app.win = new BrowserWindow({
    width: 445,
    height: 210,
    minWidth: 200,
    minHeight: 190,
    backgroundColor: '#000',
    icon: __dirname + '/' + { darwin: 'icon.icns', linux: 'icon.png', win32: 'icon.ico' }[process.platform] || 'icon.ico',
    resizable: true,
    frame: process.platform !== 'darwin',
    skipTaskbar: process.platform === 'darwin',
    autoHideMenuBar: process.platform === 'darwin',
    webPreferences: { zoomFactor: 1.0, nodeIntegration: true, backgroundThrottling: false }
  })

  app.win.loadURL(`file://${__dirname}/sources/index.html`)
  // app.inspect()

  app.win.on('closed', () => {
    win = null
    app.quit()
  })

  app.win.on('hide', function () {
    isShown = false
  })

  app.win.on('show', function () {
    isShown = true
  })

  app.on('window-all-closed', () => {
    app.quit()
  })

  app.on('activate', () => {
    if (app.win === null) {
      createWindow()
    } else {
      app.win.show()
    }
  })
})

app.inspect = function () {
  app.win.toggleDevTools()
}

app.toggleFullscreen = function () {
  app.win.setFullScreen(!app.win.isFullScreen())
}

app.toggleVisible = function () {
  if (process.platform === 'darwin') {
    if (isShown && !app.win.isFullScreen()) { app.win.hide() } else { app.win.show() }
  } else {
    if (!app.win.isMinimized()) { app.win.minimize() } else { app.win.restore() }
  }
}

app.injectMenu = function (menu) {
  try {
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
  } catch (err) {
    console.warn('Cannot inject menu.')
  }
}
