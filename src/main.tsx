import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { App } from './App';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
