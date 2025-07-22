import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import TestApp from './TestApp.jsx'
import './index.css'

// Temporarily use TestApp to debug deployment issues
// Change back to <App /> once working
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>,
)
