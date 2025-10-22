import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { LoadingProvider } from './context/LoadingContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Router> {/* Router must be on the outside */}
        <LoadingProvider>
          <App />
        </LoadingProvider>
      </Router>
    </AuthProvider>
  </React.StrictMode>,
)