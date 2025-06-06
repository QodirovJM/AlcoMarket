import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login({ setIsAuthenticated, setUserRole }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);

      // Обновляем состояние в App
      setIsAuthenticated(true);
      setUserRole(res.data.role);

      navigate('/items');
    } catch (err) {
      setError('Неверные данные');
    }
  };

  return (
    <div className="col-md-4 mx-auto mt-5">
      <h3>Вход</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            name="email"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Пароль</label>
          <input
            type="password"
            name="password"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button className="btn btn-primary w-100">Войти</button>
      </form>

      <div className="text-center mt-3">
        <span>Нет аккаунта? </span>
        <Link to="/register">Зарегистрироваться</Link>
      </div>
    </div>
  );
}

export default Login;
