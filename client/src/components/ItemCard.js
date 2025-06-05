import React from 'react';

function ItemCard({ item, onEdit, onDelete }) {
  return (
    <div className="card mb-2">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title mb-1">{item.name}</h5>
          <p className="card-text">{item.description}</p>
        </div>
        <div>
          <button className="btn btn-outline-primary me-2 btn-sm" onClick={() => onEdit(item.id)}>Редактировать</button>
          <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(item.id)}>Удалить</button>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
