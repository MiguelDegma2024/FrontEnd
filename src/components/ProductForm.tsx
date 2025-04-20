import React, { useState, useEffect } from 'react';
import { Product, Category } from 'my-types';

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onSubmit: (productData: Omit<Product, 'id' | 'category'>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categories,
  onSubmit,
  onCancel
}) => {
  // Aseguramos un valor por defecto para categoryId
  const defaultCategoryId = categories && categories.length > 0 && categories[0] ? categories[0].id : 0;

  const [formData, setFormData] = useState<Omit<Product, 'id' | 'category'>>({
    title: '',
    description: '',
    price: 0,
    discountPercentage: 0,
    rating: 0,
    stock: 0,
    categoryId: defaultCategoryId
  });

  useEffect(() => {
    if (product) {
      // Aseguramos que todos los campos tengan valores válidos
      const { id, category, ...productData } = product;
      setFormData({
        title: productData.title || '',
        description: productData.description || '',
        price: typeof productData.price === 'number' ? productData.price : 0,
        discountPercentage: typeof productData.discountPercentage === 'number' ? productData.discountPercentage : 0,
        rating: typeof productData.rating === 'number' ? productData.rating : 0,
        stock: typeof productData.stock === 'number' ? productData.stock : 0,
        categoryId: productData.categoryId || defaultCategoryId
      });
    }
  }, [product, defaultCategoryId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['price', 'discountPercentage', 'rating', 'stock', 'categoryId'].includes(name)
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Verificamos que las categorías sean válidas
  const validCategories = categories.filter(cat => cat && cat.id && cat.name);

  return (
    <div className="box">
      <h2 className="title is-4">{product ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Título</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Descripción</label>
          <div className="control">
            <textarea
              className="textarea"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="columns">
          <div className="column">
            <div className="field">
              <label className="label">Precio</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  name="price"
                  value={formData.price || 0}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="column">
            <div className="field">
              <label className="label">Descuento (%)</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage || 0}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="columns">
          <div className="column">
            <div className="field">
              <label className="label">Rating</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  name="rating"
                  value={formData.rating || 0}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.1"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="column">
            <div className="field">
              <label className="label">Stock</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  name="stock"
                  value={formData.stock || 0}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="field">
          <label className="label">Categoría</label>
          <div className="control">
            <div className="select is-fullwidth">
              <select 
                name="categoryId" 
                value={formData.categoryId || ''}
                onChange={handleChange}
                required
              >
                {validCategories.length === 0 ? (
                  <option value="">No hay categorías disponibles</option>
                ) : (
                  validCategories.map(category => (
                    <option key={`cat-${category.id}`} value={category.id}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="field is-grouped mt-5">
          <div className="control">
            <button type="submit" className="button is-primary">
              {product ? 'Actualizar' : 'Crear'}
            </button>
          </div>
          <div className="control">
            <button 
              type="button" 
              className="button is-light"
              onClick={onCancel}
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;