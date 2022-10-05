import { ipcRenderer, contextBridge } from 'electron'

declare global {
  interface Window {
    Main: typeof api
  }
}

const api = {
  window: {
    admin: {
      minimize: () => {
        ipcRenderer.send('minimize-admin')
      },
      maximize: () => {
        ipcRenderer.send('maximize-admin')
      },
      close: () => {
        ipcRenderer.send('close-admin')
      },
    },
    client: {
      open: () => {
        ipcRenderer.send('open-client')
      },
      minimize: () => {
        ipcRenderer.send('minimize-client')
      },
      maximize: () => {
        ipcRenderer.send('maximize-client')
      },
      close: () => {
        ipcRenderer.send('close-client')
      },
    }
  },
  on: (channel: string, callback: (data: any) => void) => {
    const ipc = ipcRenderer.on(channel, (_, data) => callback(data))
    return () => ipc.off(channel, callback)
  }
}

contextBridge.exposeInMainWorld('Main', api)
