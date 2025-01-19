import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { HomeProvider } from './Context/HomeContext.jsx'; // Adjust the path as needed

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HomeProvider>
      <App />
    </HomeProvider>
  </StrictMode>
);
