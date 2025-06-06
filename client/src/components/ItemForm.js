import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ItemForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [category, setCategory] = useState('Крепкий алкоголь');

  const navigate = useNavigate();
  const { id } = useParams(); // если есть id — редактируем

  useEffect(() => {
    if (id) {
      const token = localStorage.getItem('token');
      axios.get(`http://localhost:5000/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const item = res.data;
        setName(item.name);
        setDescription(item.description);
        setPrice(item.price || '');
        setImageUrl(item.image_url || '');
        setCategory(item.category || 'Крепкий алкоголь');
      })
      .catch(() => setError('Не удалось загрузить данные'));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = { name, description, price, image_url: imageUrl, category };

    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/items/${id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/items', data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate('/items');
    } catch (err) {
      setError('Ошибка при сохранении');
    }
  };

  return (
    <div className="container mt-4">
      <h3>{id ? 'Редактировать товар' : 'Добавить товар'}</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Название</label>
          <input type="text" className="form-control" value={name} required onChange={e => setName(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Описание</label>
          <textarea className="form-control" value={description} required onChange={e => setDescription(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Цена (₽)</label>
          <input type="number" className="form-control" value={price} onChange={e => setPrice(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">URL изображения</label>
          <input type="url" className="form-control" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Категория</label>
          <select className="form-select" value={category} onChange={e => setCategory(e.target.value)} required>
            <option value="Крепкий алкоголь">Крепкий алкоголь</option>
            <option value="Вино">Вино</option>
            <option value="Пиво">Пиво</option>
          </select>
        </div>


        <button type="submit" className="btn btn-primary">{id ? 'Сохранить изменения' : 'Добавить товар'}</button>
      </form>
    </div>
  );
}

export default ItemForm;
