// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import HomePage from './pages/HomePage';
import StillPage from './pages/StillPage';
import AllAnimationsPage from './pages/AllAnimationsPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="still" element={<StillPage />} />
          <Route path="animations" element={<AllAnimationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
