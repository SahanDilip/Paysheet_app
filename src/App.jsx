import React, {  useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './components/Dashoboard/MainLayout'; 
import Login from './pages/Login/Login';
import Landing from './pages/Landing/Landing'; 
import Home from './pages/Dashboard/Home/Home'; 
import { HomeContext } from './Context/HomeContext';

const App = () => {
  const { isAuthenticated, setIsAuthenticated} = useContext(HomeContext);

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