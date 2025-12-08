import styled from '@emotion/styled';
import { StatCard } from '../components/StatCard';
import { RecentSalesTable } from '../components/RecentSalesTable';
import { SimpleTable } from '../components/SimpleTable';
import { BarChart, LineChart, DoughnutChart } from '../components/Charts';
import { Package, DollarSign, Users, FolderOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { 
  fetchDashboardStats,
  fetchTopProducts,
  fetchRecentProducts,
  fetchRecentSales,
  fetchSalesChart,
  fetchProductsByCategory,
  fetchDailySales
} from '../services/api';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-4);

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const TablesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--space-4);
`;

export function Dashboard() {
  // State for dynamic data
  const [topProducts, setTopProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [salesChartData, setSalesChartData] = useState({ labels: [], values: [] });
  const [categoryChartData, setCategoryChartData] = useState({ labels: [], values: [] });
  const [dailySalesChartData, setDailySalesChartData] = useState({ labels: [], values: [] });
  const [stats, setStats] = useState({ users: 0, categories: 0, products: 0, sales: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, topProductsData, recentProductsData, recentSalesData, salesChartData, categoryChartData, dailySalesChartData] = await Promise.all([
          fetchDashboardStats(),
          fetchTopProducts(),
          fetchRecentProducts(),
          fetchRecentSales(),
          fetchSalesChart(),
          fetchProductsByCategory(),
          fetchDailySales()
        ]);

        setStats(statsData);
        setTopProducts(topProductsData);
        setRecentProducts(recentProductsData);
        setRecentSales(recentSalesData);
        setSalesChartData(salesChartData);
        setCategoryChartData(categoryChartData);
        setDailySalesChartData(dailySalesChartData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <DashboardContainer>
      <StatsGrid>
        <StatCard
          title="Usuarios"
          value={loading ? '...' : stats.users}
          icon={Users}
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        />
        <StatCard
          title="Categorías"
          value={loading ? '...' : stats.categories}
          icon={FolderOpen}
          gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        />
        <StatCard
          title="Productos"
          value={loading ? '...' : stats.products}
          icon={Package}
          gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
        />
        <StatCard
          title="Ventas"
          value={loading ? '...' : stats.sales}
          icon={DollarSign}
          gradient="linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
        />
      </StatsGrid>

      <TablesGrid>
        <SimpleTable
          title="Productos más vendidos"
          columns={['Título', 'Total vendido', 'Cantidad total']}
          data={topProducts.map((p) => [p.name, p.totalSold, p.totalQty])}
        />
        <RecentSalesTable data={recentSales} />
        <SimpleTable
          title="Productos recientemente añadidos"
          columns={['Producto', 'Categoría', 'Precio']}
          data={recentProducts.map((p) => [p.name, p.category, `$${parseFloat(p.sale_price ?? p.price ?? 0).toFixed(2)}`])}
        />
      </TablesGrid>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
        <BarChart data={salesChartData} title="Ventas Mensuales" />
        <DoughnutChart data={categoryChartData} title="Productos por Categoría" />
        <LineChart data={dailySalesChartData} title="Tendencia de Ventas Diarias" />
      </div>
    </DashboardContainer>
  );
}
