import React, { useState, useEffect } from 'react';
import { Sale, Product, User, SaleSummary } from 'my-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faChartLine, faMoneyBillWave, faBoxOpen, faFilter, faUser } from "@fortawesome/free-solid-svg-icons";
import { getAllSales } from '../Api/SaleApi'; // Assuming this is correctly implemented

interface SaleWithRelations extends Sale {
  user: User;
  product: Product;
}

const SalePage: React.FC = () => {
  const [sales, setSales] = useState<SaleWithRelations[]>([]);
  const [filteredSales, setFilteredSales] = useState<SaleWithRelations[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filter, setFilter] = useState({ productId: '', userId: '' });

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const salesData = await getAllSales() as SaleWithRelations[];
        console.log('Datos recibidos:', salesData);
        
        if (Array.isArray(salesData)) {
          setSales(salesData);
          setFilteredSales(salesData);
        } else {
          console.error('La respuesta procesada no es un array:', salesData);
          setSales([]);
          setFilteredSales([]);
          setError('El formato de los datos recibidos no es válido.');
        }
      } catch (err) {
        console.error('Error al cargar ventas:', err);
        setError('Error al cargar los datos de ventas. Por favor, intenta nuevamente.');
        setSales([]);
        setFilteredSales([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  useEffect(() => {
    // Verificar que sales sea un array antes de intentar filtrarlo
    if (!Array.isArray(sales)) {
      setFilteredSales([]);
      return;
    }
    
    let result = [...sales];
    
    if (filter.productId) {
      result = result.filter(sale => 
        sale.productId.toString() === filter.productId || 
        (sale.product?.title?.toLowerCase().includes(filter.productId.toLowerCase()) || false)
      );
    }
    
    if (filter.userId) {
      result = result.filter(sale => 
        sale.userId.toString() === filter.userId || 
        (sale.user?.name?.toLowerCase().includes(filter.userId.toLowerCase()) || false)
      );
    }
    
    setFilteredSales(result);
  }, [filter, sales]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  // Calcular el resumen de ventas con verificación para evitar errores
  const calculateSummary = () => {
    if (!Array.isArray(sales)) return { totalSales: 0, totalRevenue: 0 };
    
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);
    return { totalSales, totalRevenue };
  };

  // Calcular resumen por producto con verificación para evitar errores
  const calculateProductSummary = (): (SaleSummary & { productTitle?: string })[] => {
    if (!Array.isArray(sales)) return [];
    
    const summaryMap = new Map<number, SaleSummary & { productTitle?: string }>();
    
    sales.forEach(sale => {
      if (!sale || sale.productId === undefined) return;
      
      const productId = sale.productId;
      if (!summaryMap.has(productId)) {
        summaryMap.set(productId, {
          productId,
          productTitle: sale.product?.title || `Producto #${productId}`,
          totalSales: 0,
          totalRevenue: 0
        });
      }
      
      const summary = summaryMap.get(productId)!;
      summary.totalSales += sale.quantity || 0;
      summary.totalRevenue += sale.totalPrice || 0;
    });
    
    return Array.from(summaryMap.values());
  };

  const { totalSales, totalRevenue } = calculateSummary();
  const productSummaries = calculateProductSummary();

  if (loading) {
    return (
      <div className="is-flex is-justify-content-center is-align-items-center py-6">
        <span className="loader"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notification is-danger">
        <p>{error}</p>
      </div>
    );
  }

  // Verificación adicional para asegurarse de que sales y filteredSales son arrays
  if (!Array.isArray(sales)) {
    console.error('sales no es un array antes de renderizar', sales);
    return (
      <div className="notification is-danger">
        <p>Error en el formato de datos. Por favor, recargue la página.</p>
      </div>
    );
  }

  if (!Array.isArray(filteredSales)) {
    console.error('filteredSales no es un array antes de renderizar', filteredSales);
    return (
      <div className="notification is-danger">
        <p>Error en el formato de datos filtrados. Por favor, recargue la página.</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            <span className="icon-background has-background-primary mr-3">
              <FontAwesomeIcon icon={faShoppingCart} size="lg" className="has-text-white" />
            </span>
            Gestión de Ventas
          </p>
        </header>
        
        <div className="card-content">
          {/* Filtros */}
          <div className="columns">
            <div className="column">
              <button 
                className="button is-info is-fullwidth" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <span className="icon"><FontAwesomeIcon icon={faFilter} /></span>
                <span>{showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="box mt-4 mb-5">
              <h2 className="subtitle is-5 mb-3">Filtrar Ventas</h2>
              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label">Producto</label>
                    <div className="control has-icons-left">
                      <input 
                        className="input" 
                        type="text" 
                        name="productId" 
                        value={filter.productId} 
                        onChange={handleFilterChange} 
                        placeholder="ID o nombre del producto" 
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faBoxOpen} />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="column">
                  <div className="field">
                    <label className="label">Cliente</label>
                    <div className="control has-icons-left">
                      <input 
                        className="input" 
                        type="text" 
                        name="userId" 
                        value={filter.userId} 
                        onChange={handleFilterChange} 
                        placeholder="ID o nombre del cliente" 
                      />
                      <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faUser} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="buttons mt-3">
                <button className="button is-info" onClick={() => setFilteredSales(Array.isArray(sales) ? sales : [])}>
                  Aplicar Filtros
                </button>
                <button className="button is-light" onClick={() => setFilter({ productId: '', userId: '' })}>
                  Limpiar Filtros
                </button>
              </div>
            </div>
          )}

          {/* Notificación con resumen */}
          <div className="notification is-light is-info is-flex is-justify-content-space-between">
            <span>Total de Ventas: <strong>{filteredSales.length}</strong></span>
            {filter.productId || filter.userId ? 
              <span>Filtrando por: {filter.productId ? `Producto: "${filter.productId}"` : ''} {filter.productId && filter.userId ? ' y ' : ''} {filter.userId ? `Cliente: "${filter.userId}"` : ''}</span>
              : <span>Mostrando todas las ventas</span>
            }
          </div>

          {/* Resumen de Ventas */}
          <div className="columns">
            <div className="column">
              <div className="card has-background-light">
                <div className="card-content">
                  <p className="title is-4">
                    <span className="icon-text">
                      <span className="icon has-text-primary">
                        <FontAwesomeIcon icon={faShoppingCart} />
                      </span>
                      <span>Resumen de Ventas</span>
                    </span>
                  </p>
                  <div className="content">
                    <div className="is-flex is-justify-content-space-between mb-2">
                      <span>Total de ventas:</span>
                      <span className="has-text-weight-bold">{totalSales}</span>
                    </div>
                    <div className="is-flex is-justify-content-space-between">
                      <span>Ingresos totales:</span>
                      <span className="has-text-weight-bold has-text-success">
                        ${(totalRevenue || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Resumen por Producto */}
          {productSummaries.length > 0 && (
            <div className="mb-5">
              <p className="title is-4 mt-5">
                <span className="icon-text">
                  <span className="icon has-text-info">
                    <FontAwesomeIcon icon={faChartLine} />
                  </span>
                  <span>Ventas por Producto</span>
                </span>
              </p>
              <div className="columns is-multiline">
                {productSummaries.map(summary => {
                  return (
                    <div key={summary.productId} className="column is-4">
                      <div className="card">
                        <div className="card-content">
                          <p className="title is-5">{summary.productTitle || `Producto #${summary.productId}`}</p>
                          <div className="content">
                            <div className="is-flex is-justify-content-space-between mb-2">
                              <span>Unidades vendidas:</span>
                              <span className="has-text-weight-bold">{summary.totalSales}</span>
                            </div>
                            <div className="is-flex is-justify-content-space-between">
                              <span>Ingresos:</span>
                              <span className="has-text-weight-bold has-text-success">
                                ${(summary.totalRevenue || 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Lista de Ventas */}
          <p className="title is-4 mt-5">
            <span className="icon-text">
              <span className="icon has-text-warning">
                <FontAwesomeIcon icon={faMoneyBillWave} />
              </span>
              <span>Listado de Ventas</span>
            </span>
          </p>
          
          {filteredSales.length > 0 ? (
            <div className="table-container">
              <table className="table is-hoverable is-fullwidth">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Producto</th>
                    <th>Cliente</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Total</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((sale) => (
                    <tr key={sale.id}>
                      <th>{sale.id}</th>
                      <td>{sale.product?.title || 'N/A'}</td>
                      <td>{sale.user?.name || 'N/A'}</td>
                      <td>{sale.quantity || 0}</td>
                      <td>${(sale.product?.price || 0).toFixed(2)}</td>
                      <td className="has-text-weight-bold has-text-success">
                        ${(sale.totalPrice || 0).toFixed(2)}
                      </td>
                      <td>{sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="notification is-light">
              <p className="has-text-centered">No hay ventas registradas en el sistema.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalePage;