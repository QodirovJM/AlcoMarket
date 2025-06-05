import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Items from './components/Items';
import ItemForm from './components/ItemForm';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="container mt-4">
      <nav className="d-flex justify-content-between mb-4">
        <h4>Item Manager</h4>
        <div>
          {isAuthenticated ? (
            <>
              <Link to="/items" className="btn btn-outline-primary me-2">Товары</Link>
              <button onClick={handleLogout} className="btn btn-outline-danger">Выйти</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-outline-success">Войти</Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/items" element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Items />
          </PrivateRoute>
        } />
        <Route path="/items/new" element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <ItemForm />
          </PrivateRoute>
        } />
        <Route path="/items/edit/:id" element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <ItemForm />
          </PrivateRoute>
        } />
        <Route path="/" element={<Navigate to="/items" />} />
      </Routes>
    </div>
  );
}

export default App;
