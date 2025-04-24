// components/Dashboard.tsx
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChartLine, 
  faBoxes, 
  faUsers, 
  faStore, 
  faMoneyBillWave,
  faShoppingCart
} from "@fortawesome/free-solid-svg-icons";
import Chart from 'chart.js/auto';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../Api/ProductAPI';
import { getAllUsers } from '../Api/UserAPI';
import { getAllBranches } from '../Api/BranchAPI';
import { getAllCategories } from '../Api/CategoryAPI';
import { Product, User, Branch } from 'my-types';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  change?: string;
  isPositive?: boolean;
  isLoading?: boolean;
}

const StatCard = ({ title, value, icon, color, change, isPositive = true, isLoading = false }: StatCardProps) => {
  return (
    <div className="card fade-in">
      <div className="card-content">
        <div className="level is-mobile mb-2">
          <div className="level-left">
            <div className={`level-item icon-background has-background-${color} p-3 is-rounded`}>
              <FontAwesomeIcon icon={icon} className={`has-text-${color}-dark`} size="lg" />
            </div>
          </div>
          {change && (
            <div className="level-right">
              <div className={`level-item tag ${isPositive ? 'is-success' : 'is-danger'}`}>
                {isPositive ? '+' : ''}{change}
              </div>
            </div>
          )}
        </div>
        
        <p className="heading has-text-grey mb-1">{title}</p>
        {isLoading ? (
          <p className="title is-4"><span className="is-loading-content"></span></p>
        ) : (
          <p className="title is-4">{value}</p>
        )}
      </div>
    </div>
  );
};

interface RecentSale {
  id: number;
  client: string;
  product: string;
  date: string;
  amount: number;
}

const Dashboard = () => {
  const salesChartRef = useRef<HTMLCanvasElement | null>(null);
  const productsChartRef = useRef<HTMLCanvasElement | null>(null);
  
  // Estado para almacenar datos de la API
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  
  // Cargar datos cuando se monta el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Cargar productos, usuarios y sucursales en paralelo
        const [productsData, usersData, branchesData, categoriesData] = await Promise.all([
          getAllProducts(),
          getAllUsers(),
          getAllBranches(),
          getAllCategories()
        ]);
        
        setProducts(productsData);
        setUsers(usersData);
        setBranches(branchesData);
        setCategories(categoriesData);
        
        // Generar ventas recientes basadas en productos reales
        if (productsData.length > 0) {
          const fakeSales = generateRecentSales(productsData);
          setRecentSales(fakeSales);
        }
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Generar datos de ventas recientes basados en productos reales
  const generateRecentSales = (products: Product[]): RecentSale[] => {
    const clientNames = [
      'Carlos Martínez', 'Ana García', 'Luis Rodríguez', 
      'María López', 'Juan Pérez', 'Laura Sánchez'
    ];
    
    // Tomar hasta 5 productos aleatorios
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    const selectedProducts = shuffled.slice(0, Math.min(5, products.length));
    
    // Generar ventas recientes con fechas de los últimos 10 días
    return selectedProducts.map((product, index) => {
      const daysAgo = index + 1;
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      return {
        id: index + 1,
        client: clientNames[index % clientNames.length],
        product: product.title,
        date: date.toISOString().split('T')[0],
        amount: product.price
      };
    });
  };
  
  // Calcular el valor total del inventario
  const calculateInventoryValue = (): number => {
    return products.reduce((total, product) => total + (product.price * product.stock), 0);
  };
  
  // Actualizar gráfico de ventas cuando cambien los datos
  useEffect(() => {
    if (!isLoading && salesChartRef.current) {
      // Generar datos de ventas mensuales basados en productos
      const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
      
      // Simulamos datos de ventas basados en el inventario y un factor aleatorio
      const monthlySales = months.map((_, index) => {
        const inventoryValue = calculateInventoryValue();
        const factor = 0.7 + (index * 0.1); // Aumenta gradualmente para mostrar tendencia
        return Math.round(inventoryValue * factor / 10) * 10;
      });
      
      const salesChart = new Chart(salesChartRef.current, {
        type: 'line',
        data: {
          labels: months,
          datasets: [{
            label: 'Ventas 2025',
            data: monthlySales,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: 'rgba(255, 255, 255, 0.87)'
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.6)'
              }
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.6)'
              }
            }
          }
        }
      });

      return () => {
        salesChart.destroy();
      };
    }
  }, [isLoading, products]);

  // Actualizar gráfico de productos por categoría
  useEffect(() => {
    if (!isLoading && productsChartRef.current && categories.length > 0) {
      // Contar productos por categoría
      const categoryCounts: Record<string, number> = {};
      
      products.forEach(product => {
        const categoryName = product.category?.name || 'Sin categoría';
        categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
      });
      
      const categoryNames = Object.keys(categoryCounts);
      const counts = Object.values(categoryCounts);
      
      // Colores para las categorías (hasta 10 categorías)
      const colors = [
        '#6366f1', // indigo
        '#8b5cf6', // violet
        '#ec4899', // pink
        '#14b8a6', // teal
        '#6b7280', // gray
        '#ef4444', // red
        '#f59e0b', // amber
        '#10b981', // emerald
        '#3b82f6', // blue
        '#8d4bbb'  // purple
      ];
      
      const productsChart = new Chart(productsChartRef.current, {
        type: 'doughnut',
        data: {
          labels: categoryNames,
          datasets: [{
            data: counts,
            backgroundColor: colors.slice(0, categoryNames.length),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: 'rgba(255, 255, 255, 0.87)'
              }
            },
            title: {
              display: true,
              text: 'Productos por Categoría',
              color: 'rgba(255, 255, 255, 0.87)'
            }
          }
        }
      });

      return () => {
        productsChart.destroy();
      };
    }
  }, [isLoading, products, categories]);

  // Formatear número como moneda
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-MX', { 
      style: 'currency', 
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="container">
      <div className="columns mt-5 mb-5">
        <div className="column">
          <h1 className="title">Dashboard</h1>
          <h2 className="subtitle">Bienvenido a tu centro de control</h2>
        </div>
      </div>

      <div className="columns is-multiline">
        {/* Tarjetas de estadísticas */}
        <div className="column is-3">
          <StatCard 
            title="Valor de Inventario" 
            value={isLoading ? "Cargando..." : formatCurrency(calculateInventoryValue())} 
            icon={faMoneyBillWave} 
            color="primary"
            isLoading={isLoading}
          />
        </div>
        <div className="column is-3">
          <StatCard 
            title="Productos" 
            value={isLoading ? "Cargando..." : products.length} 
            icon={faBoxes} 
            color="info"
            isLoading={isLoading}
          />
        </div>
        <div className="column is-3">
          <StatCard 
            title="Usuarios" 
            value={isLoading ? "Cargando..." : users.length} 
            icon={faUsers} 
            color="success"
            isLoading={isLoading}
          />
        </div>
        <div className="column is-3">
          <StatCard 
            title="Sucursales" 
            value={isLoading ? "Cargando..." : branches.length} 
            icon={faStore} 
            color="warning"
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="columns">
        {/* Gráfico de ventas */}
        <div className="column is-8">
          <div className="card">
            <header className="card-header">
              <p className="card-header-title">
                <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                Análisis de Ventas
              </p>
            </header>
            <div className="card-content">
              <div className="content">
                {isLoading ? (
                  <div className="has-text-centered">
                    <p>Cargando datos de ventas...</p>
                    <progress className="progress is-small is-primary" max="100"></progress>
                  </div>
                ) : (
                  <canvas ref={salesChartRef} height="300"></canvas>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de productos */}
        <div className="column is-4">
          <div className="card">
            <header className="card-header">
              <p className="card-header-title">
                <FontAwesomeIcon icon={faBoxes} className="mr-2" />
                Distribución por Categoría
              </p>
            </header>
            <div className="card-content">
              <div className="content">
                {isLoading ? (
                  <div className="has-text-centered">
                    <p>Cargando datos de productos...</p>
                    <progress className="progress is-small is-primary" max="100"></progress>
                  </div>
                ) : products.length === 0 ? (
                  <div className="notification is-warning">
                    No hay productos disponibles
                  </div>
                ) : (
                  <canvas ref={productsChartRef} height="300"></canvas>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="columns mt-4">
        <div className="column is-12">
          <div className="card">
            <header className="card-header">
              <p className="card-header-title">
                <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                Ventas Recientes
              </p>
              <Link to="/orders" className="card-header-icon">
                <span className="icon">
                  Ver todas <FontAwesomeIcon icon={faShoppingCart} className="ml-2" />
                </span>
              </Link>
            </header>
            <div className="card-content">
              <div className="content">
                {isLoading ? (
                  <progress className="progress is-small is-primary" max="100"></progress>
                ) : recentSales.length === 0 ? (
                  <div className="notification is-warning">
                    No hay ventas recientes disponibles
                  </div>
                ) : (
                  <table className="table is-fullwidth is-hoverable">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Producto</th>
                        <th>Fecha</th>
                        <th>Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSales.map((sale) => (
                        <tr key={sale.id}>
                          <td>{sale.client}</td>
                          <td>{sale.product}</td>
                          <td>{sale.date}</td>
                          <td>{formatCurrency(sale.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;