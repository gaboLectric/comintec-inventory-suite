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
  gap: var(--space-4);
  
  /* Mobile-first responsive grid */
  grid-template-columns: 1fr;
  
  /* Tablet: 2 columns */
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  /* Desktop: auto-fit with minimum card width */
  @media (min-width: var(--breakpoint-mobile)) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
  
  /* Large desktop: maximum 4 columns */
  @media (min-width: var(--breakpoint-tablet)) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    max-width: 1200px;
  }
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
             addToast(`Atención: ${statsData.lowStock} insumos con bajo stock`, 'warning', { placement: 'top-right', important: true, durationMs: 10000 });
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
          gradient="#3B82F6"
        />
        {userLevel <= 2 && (
            <>
                <StatCard
                  title="Insumos"
                  value={loading ? '...' : stats.supplies}
                  icon={Box}
                  gradient="#8B5CF6"
                />
                <StatCard
                  title="Bajo Stock"
                  value={loading ? '...' : stats.lowStock}
                  icon={AlertTriangle}
                  gradient={stats.lowStock > 0 ? "#EF4444" : "#22C55E"}
                />
            </>
        )}
        {userLevel === 1 && (
            <StatCard
              title="Usuarios"
              value={loading ? '...' : stats.users}
              icon={Users}
              gradient="#14B8A6"
            />
        )}
      </StatsGrid>
    </DashboardContainer>
  );
}
