import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Items from './components/Items';
import ItemForm from './components/ItemForm';
import PrivateRoute from './components/PrivateRoute';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import ItemDetail from './components/ItemDetail';
import Layout from './components/Layout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsAuthenticated(!!token);
    setUserRole(role);
  }, []);

  return (
    <Layout>
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              setIsAuthenticated={setIsAuthenticated}
              setUserRole={setUserRole}
            />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/items" element={<Items />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/cart" element={
          userRole === 'user' ? <Cart /> : <Navigate to="/login" />
        } />
        <Route path="/checkout" element={
          userRole === 'user' ? <Checkout /> : <Navigate to="/login" />
        } />
        <Route path="/items/new" element={
          userRole === 'admin' ? <ItemForm /> : <Navigate to="/login" />
        } />
        <Route path="/items/edit/:id" element={
          userRole === 'admin' ? <ItemForm /> : <Navigate to="/login" />
        } />
        <Route path="/" element={<Navigate to="/items" />} />
      </Routes>
    </Layout>
  );
}

export default App;
