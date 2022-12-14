import { Button } from 'ui'
import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // @ts-ignore
    const remove = window.Main.on('nameReply', () => {
      console.log('RECIBIDO')
      setCount(1000)
    })
    return () => {
      remove()
    }
  }, [])

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>ADMIN PAGE</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={() => (window as any).Main.window.client.open()}>
          Abrir cliente
        </button>
        <button onClick={() => (window as any).Main.window.client.close()}>
          Cerrar cliente
        </button>
        <button
          onClick={() =>
            (window as any).Main.window.admin.message({
              command: 'DELETE',
              data: []
            })
          }
        >
          Enviar
        </button>
        <Button />
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
