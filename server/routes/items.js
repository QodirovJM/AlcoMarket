const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');


// Получить один item по ID
router.get('/', async (req, res) => {
  const { category, page = 1, limit = 6 } = req.query;

  const offset = (page - 1) * limit;

  try {
    let query = 'SELECT * FROM items';
    const values = [];

    if (category) {
      query += ' WHERE category = $1';
      values.push(category);
    }

    query += ' ORDER BY id DESC LIMIT $2 OFFSET $3';

    const finalValues = category
      ? [category, limit, offset]
      : [limit, offset];

    const paginatedQuery = category
      ? `${query}`
      : 'SELECT * FROM items ORDER BY id DESC LIMIT $1 OFFSET $2';

    const result = await db.query(paginatedQuery, finalValues);

    // Получим общее количество для клиента
    const countRes = category
      ? await db.query('SELECT COUNT(*) FROM items WHERE category = $1', [category])
      : await db.query('SELECT COUNT(*) FROM items');

    const totalItems = parseInt(countRes.rows[0].count);

    res.json({
      items: result.rows,
      totalItems
    });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения данных', detail: err.message });
  }
});


// Получить один item по ID
router.get('/:id', async (req, res) => {
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
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { name, description, price, image_url, category } = req.body;
  try {
    await db.query(
      'INSERT INTO items (name, description, price, image_url, category) VALUES ($1, $2, $3, $4, $5)',
      [name, description, price, image_url, category]
    );
    res.status(201).json({ message: 'Товар добавлен' });
  } catch (err) {
    console.error('Ошибка при добавлении товара:', err);
    res.status(500).json({ error: 'Ошибка добавления', detail: err.message });
  }
});

// Обновить item по ID
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url, category } = req.body;
  try {
    const result = await db.query(
      'UPDATE items SET name = $1, description = $2, price = $3, image_url = $4, category = $5 WHERE id = $6 RETURNING *',
      [name, description, price, image_url, category, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка обновления', detail: err.message });
  }
});

// Удалить item по ID
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM items WHERE id = $1', [id]);
    res.json({ message: 'Товар удалён' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка удаления', detail: err.message });
  }
});

module.exports = router;
