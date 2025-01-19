import React, {  useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './components/Dashoboard/MainLayout'; 
import Login from './pages/Login/Login';
import Landing from './pages/Landing/Landing'; 
import Home from './pages/Dashboard/Home/Home'; 
// import Logs from './pages/Dashboard/Logs/Logs'; 
import { HomeContext } from './Context/HomeContext';

const App = () => {
  const { isAuthenticated, setIsAuthenticated, resetSelectedItems } = useContext(HomeContext);

  useEffect(() => {
    const checkToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessTokenFromUrl = urlParams.get('token');
      console.log(accessTokenFromUrl);

      if (accessTokenFromUrl) {
        localStorage.setItem('accessToken', accessTokenFromUrl);
        const expirationTime = Date.now() + 3600000; 
        localStorage.setItem('tokenExpiration', expirationTime);
      }

      const accessToken = localStorage.getItem('accessToken');
      console.log({ accessToken : accessToken });
      const tokenExpiration = localStorage.getItem('tokenExpiration');

      if (accessToken) {
        const currentTime = Date.now();
        if (currentTime < tokenExpiration) {
          setIsAuthenticated(true); 
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('tokenExpiration');
          setIsAuthenticated(false); 
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkToken();
  }, [setIsAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      resetSelectedItems();  
    }
  }, [isAuthenticated, resetSelectedItems]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />} />
        
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
        />
        
        <Route
          path="/dashboard"
          element={isAuthenticated ? (
            <MainLayout />
          ) : <Navigate to="/login" />}
        >
          <Route path="" element={<Home />} />
          {/* <Route path="logs" element={<Logs />} /> */}
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;