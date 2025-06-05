import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/register', form);
      setSuccess(res.data.message);
      setTimeout(() => navigate('/login'), 1500); // Перенаправление после успешной регистрации
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка регистрации');
    }
  };

  return (
    <div className="col-md-4 mx-auto mt-5">
      <h3>Регистрация</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Имя пользователя</label>
          <input name="username" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" name="email" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Пароль</label>
          <input type="password" name="password" className="form-control" onChange={handleChange} required />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <button className="btn btn-primary w-100">Зарегистрироваться</button>
      </form>

      <div className="text-center mt-3">
        <span>Уже есть аккаунт? </span>
        <Link to="/login">Войти</Link>
      </div>
    </div>
  );
}

export default Register;
