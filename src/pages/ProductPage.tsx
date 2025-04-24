import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTrash, faEdit, faPlus, faEye, faBox, faTag, faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Product, Category } from "my-types";
import { useState, useEffect } from 'react';
import { getAllProducts, deleteProduct, getProductById, createProduct, updateProduct } from "../Api/ProductAPI";
import ProductForm from "../components/ProductForm";
import ProductDetail from "../components/ProductDetail";

interface Props {}

type ModalContent = {
  type: 'none' | 'view' | 'add' | 'edit';
  product?: Product;
}

const ProductPage = (_props: Props) => {
  // COMPONENT STATE
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modal, setModal] = useState<ModalContent>({ type: 'none' });
  const [loading, setLoading] = useState<boolean>(true);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filter, setFilter] = useState({
    title: '',
    description: '',
    categoryId: 0
  });
  
  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      
      if (data && Array.isArray(data)) {
        // Filter out any null or invalid products
        const validProducts = data.filter(item => 
          item && typeof item === 'object' && item !== null
        );
        
        setProducts(validProducts);
        setFilteredProducts(validProducts);
        
        // Extract categories from products to avoid additional API call
        const categoriesMap = new Map();
        
        validProducts.forEach(item => {
          if (item && item.categoryId && item.category) {
            categoriesMap.set(item.categoryId, item.category);
          }
        });
        
        const uniqueCategories = Array.from(categoriesMap.values());
        setCategories(uniqueCategories || []);
      } else {
        console.error("Los datos recibidos no son un array:", data);
        setProducts([]);
        setFilteredProducts([]);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setFilteredProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchProducts();
  }, []);
  
  // Filter handling
  useEffect(() => {
    if (!products || products.length === 0) {
      setFilteredProducts([]);
      return;
    }
    
    let result = [...products];
    
    if (filter.title) {
      result = result.filter(p => 
        p && p.title && p.title.toLowerCase().includes(filter.title.toLowerCase())
      );
    }
    
    if (filter.description) {
      result = result.filter(p => 
        p && p.description && p.description.toLowerCase().includes(filter.description.toLowerCase())
      );
    }
    
    if (filter.categoryId > 0) {
      result = result.filter(p => p && p.categoryId === filter.categoryId);
    }
    
    setFilteredProducts(result);
  }, [filter, products]);
  
  // Filter change handler
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: name === 'categoryId' ? Number(value) : value
    }));
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilter({
      title: '',
      description: '',
      categoryId: 0
    });
  };
  
  // Delete product handler
  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        alert("Producto eliminado con éxito");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error al eliminar el producto");
      }
    }
  };
  
  // View product details
  const handleViewProduct = async (id: number) => {
    try {
      const product = await getProductById(id);
      if (product) {
        setModal({ type: 'view', product });
      } else {
        throw new Error("Product not found");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      alert("Error al obtener detalles del producto");
    }
  };
  
  // Edit product
  const handleEditProduct = async (id: number) => {
    try {
      const product = await getProductById(id);
      if (product) {
        setModal({ type: 'edit', product });
      } else {
        throw new Error("Product not found");
      }
    } catch (error) {
      console.error("Error fetching product for edit:", error);
      alert("Error al obtener el producto para editar");
    }
  };
  
  // Add new product
  const handleAddProduct = () => {
    setModal({ type: 'add' });
  };
  
  // Close modal
  const closeModal = () => {
    setModal({ type: 'none' });
  };
  
  // Form submission handler
  const handleFormSubmit = async (productData: Omit<Product, 'id' | 'category'>) => {
    try {
      if (modal.type === 'add') {
        const category = categories.find(cat => cat && cat.id === productData.categoryId);
        if (!category) {
          throw new Error("Category not found");
        }
        await createProduct({ ...productData, category });
        alert("Producto creado con éxito");
      } else if (modal.type === 'edit' && modal.product) {
        await updateProduct(modal.product.id, productData);
        alert("Producto actualizado con éxito");
      }
      closeModal();
      fetchProducts(); // Refresh products list
    } catch (error) {
      console.error("Error saving product:", error);
      alert(`Error al ${modal.type === 'add' ? 'crear' : 'actualizar'} el producto`);
    }
  };
  
  // Safe rendering helpers
  const renderProductTitle = (product: Product) => {
    return product && product.title ? product.title : 'Sin título';
  };

  const renderProductDescription = (product: Product) => {
    if (!product || !product.description) return 'Sin descripción';
    return product.description.length > 50 
      ? `${product.description.substring(0, 50)}...` 
      : product.description;
  };

  const renderPrice = (product: Product) => {
    // Check if product and product.price exist and are valid numbers
    if (!product || typeof product.price !== 'number') {
      return '$0.00';
    }
    return `$${product.price.toFixed(2)}`;
  };

  const renderNumericValue = (value: any, defaultValue = 0, suffix = '') => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return `${defaultValue}${suffix}`;
    }
    return `${value}${suffix}`;
  };

  return (
    <div className="fade-in">
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            <span className="icon-background has-background-info mr-3">
              <FontAwesomeIcon icon={faBox} size="lg" className="has-text-white" />
            </span>
            Gestión de Productos
          </p>
        </header>
        
        <div className="card-content">
          <div className="columns">
            <div className="column">
              <button 
                className="button is-primary is-fullwidth" 
                onClick={handleAddProduct}
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faPlus} />
                </span>
                <span>Añadir Nuevo Producto</span>
              </button>
            </div>
            <div className="column">
              <button 
                className="button is-info is-fullwidth" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faFilter} />
                </span>
                <span>{showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}</span>
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="box mt-4 mb-5">
              <h2 className="subtitle is-5 mb-3">Filtrar Productos</h2>
              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label">Título</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="text"
                        name="title"
                        value={filter.title}
                        onChange={handleFilterChange}
                        placeholder="Filtrar por título"
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faSearch} />
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="column">
                  <div className="field">
                    <label className="label">Descripción</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="text"
                        name="description"
                        value={filter.description}
                        onChange={handleFilterChange}
                        placeholder="Filtrar por descripción"
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faSearch} />
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="column">
                  <div className="field">
                    <label className="label">Categoría</label>
                    <div className="control has-icons-left">
                      <div className="select is-fullwidth">
                        <select 
                          name="categoryId"
                          value={filter.categoryId}
                          onChange={handleFilterChange}
                        >
                          <option value={0}>Todas las categorías</option>
                          {categories && categories.length > 0 && categories.map(cat => cat && (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faTag} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="buttons mt-3">
                <button 
                  className="button is-info" 
                  onClick={() => setFilteredProducts(products)}
                >
                  Aplicar Filtros
                </button>
                <button 
                  className="button is-light" 
                  onClick={resetFilters}
                >
                  Limpiar Filtros
                </button>
              </div>
            </div>
          )}
          
          <div className="notification is-light is-info is-flex is-justify-content-space-between">
            <span>Total de productos: <strong>{filteredProducts?.length || 0}</strong></span>
            {(filter.title || filter.description || filter.categoryId > 0) ? (
              <span>
                Filtrando por: 
                {filter.title ? ` Título: "${filter.title}"` : ''} 
                {filter.title && (filter.description || filter.categoryId > 0) ? ' y ' : ''} 
                {filter.description ? ` Descripción: "${filter.description}"` : ''}
                {(filter.title || filter.description) && filter.categoryId > 0 ? ' y ' : ''} 
                {filter.categoryId > 0 ? ` Categoría ID: ${filter.categoryId}` : ''}
              </span>
            ) : (
              <span>Mostrando todos los productos</span>
            )}
          </div>
          
          {loading ? (
            <div className="is-flex is-justify-content-center is-align-items-center py-6">
              <span className="loader"></span>
            </div>
          ) : (
            <div className="table-container">
              <table className="table is-hoverable is-fullwidth">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>
                      <abbr title="Discount Percentage">Disc.%</abbr>
                    </th>
                    <th>Rating</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {!filteredProducts || filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="has-text-centered py-5">
                        <p className="has-text-grey">No se encontraron productos</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => {
                      // Safety check for null/undefined product
                      if (!product) return null;
                      
                      return (
                        <tr key={product.id}>
                          <th>{product.id || 'N/A'}</th>
                          <td>
                            <span className="icon has-text-info">
                              <FontAwesomeIcon icon={faImage} />
                            </span>
                          </td>
                          <td>
                            <button 
                              className="button is-ghost p-0 has-text-info-dark"
                              onClick={() => product.id && handleViewProduct(product.id)}
                            >
                              {renderProductTitle(product)}
                            </button>
                          </td>
                          <td>{renderProductDescription(product)}</td>
                          <td className="has-text-weight-bold">{renderPrice(product)}</td>
                          <td>{renderNumericValue(product.discountPercentage, 0, '%')}</td>
                          <td>{renderNumericValue(product.rating, 0, '/5')}</td>
                          <td>{renderNumericValue(product.stock)}</td>
                          <td>
                            <div className="buttons are-small">
                              <button
                                className="button is-info is-rounded"
                                onClick={() => product.id && handleViewProduct(product.id)}
                                title="Ver detalles"
                                disabled={!product.id}
                              >
                                <FontAwesomeIcon icon={faEye} />
                              </button>
                              <button
                                className="button is-warning is-rounded"
                                onClick={() => product.id && handleEditProduct(product.id)}
                                title="Editar producto"
                                disabled={!product.id}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                className="button is-danger is-rounded"
                                onClick={() => product.id && handleDelete(product.id)}
                                title="Eliminar producto"
                                disabled={!product.id}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Modals */}
      {modal.type !== 'none' && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">
                {modal.type === 'view' ? 'Detalles del Producto' : 
                 modal.type === 'add' ? 'Añadir Producto' : 'Editar Producto'}
              </p>
              <button 
                className="delete" 
                aria-label="close"
                onClick={closeModal}
              ></button>
            </header>
            <section className="modal-card-body">
              {modal.type === 'view' && modal.product && (
                <ProductDetail 
                  product={modal.product} 
                  onClose={closeModal} 
                />
              )}
              
              {(modal.type === 'add' || modal.type === 'edit') && (
                <ProductForm
                  product={modal.type === 'edit' ? modal.product : undefined}
                  categories={categories || []}
                  onSubmit={handleFormSubmit}
                  onCancel={closeModal}
                />
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;