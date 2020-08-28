import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, setProduct }) => {
  const handleClick = () => {
    setProduct({
      name: product.name,
      price: product.price,
    });
  };
  return (
    <div className="ProductCard" onClick={handleClick}>
      <img src={product.img} className="card-image" alt="" />
      <h3 className="card-name">{product.name}</h3>
      <p className="card-price">${product.price}</p>
    </div>
  );
};

export default ProductCard;
