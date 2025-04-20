import React from 'react';
import { Product } from 'my-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
  // Asegurar que product sea válido
  if (!product) {
    return (
      <div className="box">
        <h2 className="title is-4">Error: Producto no disponible</h2>
        <div className="field mt-5">
          <div className="control">
            <button className="button is-info" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="box">
      <h2 className="title is-4">Detalles del Producto</h2>
      
      <div className="columns">
        <div className="column is-one-quarter">
          <div className="has-text-centered mb-4">
            <span className="icon is-large">
              <FontAwesomeIcon icon={faImage} size="5x" />
            </span>
          </div>
        </div>
        
        <div className="column">
          <div className="content">
            <p><strong>ID:</strong> {product.id || 'N/A'}</p>
            <p><strong>Título:</strong> {product.title || 'Sin título'}</p>
            <p><strong>Descripción:</strong> {product.description || 'Sin descripción'}</p>
            <p><strong>Precio:</strong> ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}</p>
            <p><strong>Descuento:</strong> {product.discountPercentage || 0}%</p>
            <p><strong>Rating:</strong> {product.rating || 0}/5</p>
            <p><strong>Stock:</strong> {product.stock || 0} unidades</p>
            <p><strong>Categoría:</strong> {product.category && product.category.name ? product.category.name : 'N/A'}</p>
          </div>
        </div>
      </div>
      
      <div className="field mt-5">
        <div className="control">
          <button className="button is-info" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;