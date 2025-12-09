import styled from '@emotion/styled';
import { StatCard } from '../components/StatCard';
import { Package, Users, AlertTriangle, Box } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchDashboardStats, getUserLevel } from '../services/api';
import { useToast } from '../components/Toast';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-4);
`;

export function Dashboard() {
  const [stats, setStats] = useState({ users: 0, equipments: 0, supplies: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const userLevel = getUserLevel();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const statsData = await fetchDashboardStats();
        setStats(statsData);
        setLoading(false);

        if (statsData.lowStock > 0 && userLevel <= 2) {
             addToast(`Atención: ${statsData.lowStock} insumos con bajo stock`, 'warning');
        }
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
          title="Equipos"
          value={loading ? '...' : stats.equipments}
          icon={Package}
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        />
        {userLevel <= 2 && (
            <>
                <StatCard
                  title="Insumos"
                  value={loading ? '...' : stats.supplies}
                  icon={Box}
                  gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                />
                <StatCard
                  title="Bajo Stock"
                  value={loading ? '...' : stats.lowStock}
                  icon={AlertTriangle}
                  gradient={stats.lowStock > 0 ? "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)" : "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)"}
                />
            </>
        )}
        {userLevel === 1 && (
            <StatCard
              title="Usuarios"
              value={loading ? '...' : stats.users}
              icon={Users}
              gradient="linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)"
            />
        )}
      </StatsGrid>
    </DashboardContainer>
  );
}
