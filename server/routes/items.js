const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');

// Получить все items
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM items ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения данных', detail: err.message });
  }
});

// Получить один item по ID
router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM items WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения товара', detail: err.message });
  }
});

// Добавить новый item
router.post('/', verifyToken, async (req, res) => {
  const { name, description, price, image_url } = req.body;
  try {
    await db.query(
      'INSERT INTO items (name, description, price, image_url) VALUES ($1, $2, $3, $4)',
      [name, description, price, image_url]
    );
    res.status(201).json({ message: 'Товар добавлен' });
  } catch (err) {
    console.error('Ошибка при добавлении товара:', err);
    res.status(500).json({ error: 'Ошибка добавления', detail: err.message });
  }
});

// Обновить item по ID
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url } = req.body;
  try {
    const result = await db.query(
      'UPDATE items SET name = $1, description = $2, price = $3, image_url = $4 WHERE id = $5 RETURNING *',
      [name, description, price, image_url, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка обновления', detail: err.message });
  }
});

// Удалить item по ID
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM items WHERE id = $1', [id]);
    res.json({ message: 'Товар удалён' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка удаления', detail: err.message });
  }
});

module.exports = router;
