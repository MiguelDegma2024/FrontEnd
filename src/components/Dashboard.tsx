// components/Dashboard.tsx
import { useEffect, useRef } from 'react';
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

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  change?: string;
  isPositive?: boolean;
}

const StatCard = ({ title, value, icon, color, change, isPositive = true }: StatCardProps) => {
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
        <p className="title is-4">{value}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const salesChartRef = useRef<HTMLCanvasElement | null>(null);
  const productsChartRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    // Ventas mensuales
    if (salesChartRef.current) {
      const salesChart = new Chart(salesChartRef.current, {
        type: 'line',
        data: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
          datasets: [{
            label: 'Ventas 2025',
            data: [3200, 4100, 3800, 5200, 6100, 7300],
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
  }, []);

  useEffect(() => {
    // Productos más vendidos
    if (productsChartRef.current) {
      const productsChart = new Chart(productsChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Laptops', 'Smartphones', 'Accesorios', 'Monitores', 'Otros'],
          datasets: [{
            data: [35, 25, 20, 15, 5],
            backgroundColor: [
              '#6366f1', // indigo
              '#8b5cf6', // violet
              '#ec4899', // pink
              '#14b8a6', // teal
              '#6b7280', // gray
            ],
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
            }
          }
        }
      });

      return () => {
        productsChart.destroy();
      };
    }
  }, []);

  // Datos de ejemplo para ventas recientes
  const recentSales = [
    { id: 1, client: 'Carlos Martínez', product: 'Laptop Pro X1', date: '2025-04-20', amount: 1299.99 },
    { id: 2, client: 'Ana García', product: 'Monitor 27"', date: '2025-04-19', amount: 349.50 },
    { id: 3, client: 'Luis Rodríguez', product: 'Teclado Mecánico', date: '2025-04-18', amount: 129.99 },
    { id: 4, client: 'María López', product: 'Mouse Inalámbrico', date: '2025-04-17', amount: 45.75 },
  ];

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
            title="Ventas Totales" 
            value="$24,780" 
            icon={faMoneyBillWave} 
            color="primary"
            change="12.5%"
            isPositive={true}
          />
        </div>
        <div className="column is-3">
          <StatCard 
            title="Productos" 
            value="142" 
            icon={faBoxes} 
            color="info"
            change="4.2%"
            isPositive={true}
          />
        </div>
        <div className="column is-3">
          <StatCard 
            title="Usuarios" 
            value="2,845" 
            icon={faUsers} 
            color="success"
            change="8.7%"
            isPositive={true}
          />
        </div>
        <div className="column is-3">
          <StatCard 
            title="Sucursales" 
            value="12" 
            icon={faStore} 
            color="warning"
            change="0%"
            isPositive={true}
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
                <canvas ref={salesChartRef} height="300"></canvas>
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
                Productos más vendidos
              </p>
            </header>
            <div className="card-content">
              <div className="content">
                <canvas ref={productsChartRef} height="300"></canvas>
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
                        <td>${sale.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;