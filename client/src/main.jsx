import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import SorryPage from './pages/SorryPage.jsx';
import './index.css';

const queryClient = new QueryClient();

const theme = createTheme({
  typography: {
    fontFamily: "'Press Start 2P', monospace",
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/invite/:guestId" element={<App />} />
            <Route path="*" element={<SorryPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
