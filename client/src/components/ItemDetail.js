import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/items/${id}`)
      .then(res => setItem(res.data))
      .catch(() => setError('Не удалось загрузить товар'));
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Товар добавлен в корзину');
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!item) return <div>Загрузка...</div>;

  return (
    <div className="container mt-4">
      <h2>{item.name}</h2>
      {item.image_url && (
        <img src={item.image_url} alt={item.name} className="img-fluid mb-3" style={{ maxHeight: 300 }} />
      )}
      <p><strong>Цена:</strong> {item.price} ₽</p>
      <p><strong>Категория:</strong> {item.category}</p>
      <p>{item.description}</p>

      {userRole === 'user' && (
        <button className="btn btn-primary" onClick={addToCart}>🛒 Добавить в корзину</button>
      )}
    </div>
  );
}

export default ItemDetail;
