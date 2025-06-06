import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('cash');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
      alert('Корзина пуста');
      return;
    }

    console.log('Оформлен заказ:', {
      name,
      address,
      payment,
      cart,
    });

    alert('Спасибо за заказ!');
    localStorage.removeItem('cart');
    navigate('/');
  };

  return (
    <div className="container mt-4">
      <h3>Оформление заказа</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Имя</label>
          <input className="form-control" required value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Адрес доставки</label>
          <textarea className="form-control" required value={address} onChange={e => setAddress(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Оплата</label>
          <select className="form-select" value={payment} onChange={e => setPayment(e.target.value)}>
            <option value="cash">Наличными курьеру</option>
            <option value="card">Картой при встрече</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Подтвердить заказ</button>
      </form>
    </div>
  );
}

export default Checkout;
