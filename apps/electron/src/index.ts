import { join } from 'path'
import isDev from 'electron-is-dev'
import { BrowserWindow, app, globalShortcut, ipcMain } from 'electron'

const adminUrl = 'http://127.0.0.1:5173/'
const clientUrl = 'http://127.0.0.1:5174/'

function createWindow(url: string, isAdmin?: boolean) {
  return () => {
    const window = new BrowserWindow({
      width: 800,
      height: 600,
      frame: true,
      resizable: true,
      fullscreenable: true,
      webPreferences: {
        preload: join(__dirname, 'preload.js')
      }
    })
  
    if (isDev) {
      window?.loadURL(url)
    } else {
      window?.loadFile(url)
    }
  
    globalShortcut.register('CmdOrCtrl+F12', () => {
      window.isFocused() && window.webContents.toggleDevTools()
    })
  
    const onCloseWindow = () => window.close()
  
    const onMinimizeWindow = () => {
      window.isMinimized() ? window.restore() : window.minimize()
    }
  
    const onMaximizeWindow = () => {
      window.isMaximized() ? window.restore() : window.maximize()
    }
  
    if (isAdmin) {
      ipcMain.on('close-admin', onCloseWindow)
      ipcMain.on('minimize-admin', onMinimizeWindow)
      ipcMain.on('maximize-admin', onMaximizeWindow)
    } else {
      ipcMain.on('close-client', onCloseWindow)
      ipcMain.on('minimize-client', onMinimizeWindow)
      ipcMain.on('maximize-client', onMaximizeWindow)
    }

  
    return {
      clean: () => {
        if (isAdmin) {
          ipcMain.off('close-admin', onCloseWindow)
          ipcMain.off('minimize-admin', onMinimizeWindow)
          ipcMain.off('maximize-admin', onMaximizeWindow)
          globalShortcut.unregister('CmdOrCtrl+F12')
        } else {
          ipcMain.off('close-client', onCloseWindow)
          ipcMain.off('minimize-client', onMinimizeWindow)
          ipcMain.off('maximize-client', onMaximizeWindow)
        }
  
      }
    }
  }
}

const createAdminWindow = createWindow(adminUrl, true)
const createClientWindow = createWindow(clientUrl)

app.whenReady().then(() => {
  let clientWindow: ReturnType<typeof createClientWindow> | null = null
  createAdminWindow()

  ipcMain.on('open-client', () => {
    clientWindow = createClientWindow()
  })
  
  ipcMain.on('close-client', () => {
    clientWindow?.clean()
  })
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createAdminWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
