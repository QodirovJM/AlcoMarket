import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Items() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/items', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data);
    } catch (err) {
      setError('Ошибка загрузки');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchItems();
    } catch {
      setError('Ошибка удаления');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Список товаров</h3>
      <Link to="/items/new" className="btn btn-success mb-3">➕ Добавить товар</Link>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {items.map(item => (
          <div key={item.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="card-img-top"
                  style={{ maxHeight: '200px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="card-img-top bg-light d-flex align-items-center justify-content-center"
                  style={{ height: '200px', color: '#999' }}
                >
                  Нет изображения
                </div>
              )}
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {item.price ? `${item.price} ₽` : 'Цена не указана'}
                </h6>
                <p className="card-text">{item.description}</p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <Link to={`/items/edit/${item.id}`} className="btn btn-sm btn-outline-primary">
                  ✏️ Редактировать
                </Link>
                <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-outline-danger">
                  🗑️ Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Items;
