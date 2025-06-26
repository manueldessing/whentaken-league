import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DataProvider } from './DataProvider'
import App from './App.jsx'
import ThemeProvider from './theme/ThemeProvider'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </ThemeProvider>
  </StrictMode>,
)
