import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Items() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [userRole, setUserRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  const theme = localStorage.getItem('theme') || 'light';
  const bgColor = theme === 'dark' ? '#1b3e2b' : '#fff8e1';
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';

  const fetchItems = async () => {
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage
      };
      if (selectedCategory) {
        params.category = selectedCategory;
      }

      const res = await axios.get('http://localhost:5000/api/items', { params });
      setItems(res.data.items || []);
      setTotalItems(res.data.totalItems || 0);
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
    setUserRole(localStorage.getItem('role') || '');
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    fetchItems();
  }, [selectedCategory, currentPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="container mt-4">
      <div className="p-3 mb-3 rounded" style={{ backgroundColor: bgColor, color: textColor }}>
        <label className="form-label">Фильтр по категории</label>
        <select className="form-select" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          <option value="">Все категории</option>
          <option value="Крепкий алкоголь">Крепкий алкоголь</option>
          <option value="Вино">Вино</option>
          <option value="Пиво">Пиво</option>
        </select>
      </div>

      <h3 className="mb-4 p-2 rounded" style={{ backgroundColor: bgColor, color: textColor }}>Список товаров</h3>

      {userRole === 'admin' && (
        <Link to="/items/new" className="btn btn-success mb-3">➕ Добавить товар</Link>
      )}
      {userRole === 'user' && (
        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-outline-primary" onClick={() => navigate('/cart')}>
            🛒 Корзина
          </button>
        </div>
      )}
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
                  style={{ aspectRatio: '4 / 3', objectFit: 'cover', width: '100%' }}
                />
              ) : (
                <div
                  className="card-img-top bg-light d-flex align-items-center justify-content-center"
                  style={{ height: '200px', color: '#999' }}
                >
                  Нет изображения
                </div>
              )}
              <div className="card-body" style={{ backgroundColor: bgColor, color: textColor }}>
                <h5 className="card-title">{item.name}</h5>
                <h6 className="card-subtitle mb-2" style={{ color: theme === 'dark' ? '#ccc' : '#666' }}>
                  {item.price ? `${item.price} ₽` : 'Цена не указана'}
                </h6>
                <p className="card-text">{item.description}</p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <Link to={`/items/${item.id}`} className="btn btn-sm btn-outline-secondary">🔍 Подробнее</Link>
                {userRole === 'admin' && (
                  <div className="d-flex gap-2">
                    <Link to={`/items/edit/${item.id}`} className="btn btn-sm btn-outline-primary">
                      ✏️ Редактировать
                    </Link>
                    <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-outline-danger">
                      🗑️ Удалить
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div
          className="d-flex justify-content-center align-items-center mt-5 p-3 rounded gap-3"
          style={{
            backgroundColor: theme === 'dark' ? '#1b3e2b' : '#f0f0e6',
            color: theme === 'dark' ? 'white' : 'black',
            boxShadow: '0 0 10px rgba(0,0,0,0.15)'
          }}
        >
          <button
            className="btn btn-outline-secondary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            ◀ Предыдущая
          </button>
          <span className="align-self-center">
            Страница {currentPage} из {totalPages}
          </span>
          <button
            className="btn btn-outline-secondary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Следующая ▶
          </button>
        </div>
      )}
    </div>
  );
}

export default Items;
