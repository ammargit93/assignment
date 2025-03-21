// src/components/Card.js
import React from 'react';
import './Card.css'; // Import CSS for styling

const Card = ({ title, children }) => {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;