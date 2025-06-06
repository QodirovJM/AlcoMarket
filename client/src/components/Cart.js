import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const removeFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const total = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="container mt-4">
      <h3>🛒 Корзина</h3>
      {cart.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cart.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {item.name} — {item.price} ₽
                <button onClick={() => removeFromCart(index)} className="btn btn-sm btn-danger">Удалить</button>
              </li>
            ))}
          </ul>
          <p><strong>Итого:</strong> {total} ₽</p>
          <button onClick={handleCheckout} className="btn btn-success">Оформить заказ</button>
        </>
      )}
    </div>
  );
}

export default Cart;
