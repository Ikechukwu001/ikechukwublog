import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import App from './App';
import Post from './Post';
import './index.css';
import ReactGA from "react-ga4";

// Initialize GA once
ReactGA.initialize("G-KK1XK4L8W4");

// Custom hook for page tracking
function usePageTracking() {
  const location = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);
}

// Wrapper component so GA can hook into Router changes
function AnalyticsWrapper() {
  usePageTracking();
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/post/:slug" element={<Post />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AnalyticsWrapper />
  </BrowserRouter>
);
