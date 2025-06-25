import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DataProvider } from './DataProvider'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </StrictMode>,
)
