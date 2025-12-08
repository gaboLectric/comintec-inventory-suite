import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useTheme } from '../comintec-design-system/emotion/ThemeProvider';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const getChartOptions = (mode) => {
  const textColor = mode === 'dark' ? '#eeeeec' : '#111827';
  const gridColor = mode === 'dark' ? '#3e3e3a' : '#e5e7eb';
  const tickColor = mode === 'dark' ? '#a1a09a' : '#6b7280';

  return {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
        },
      },
      title: {
        display: true,
        color: textColor,
      },
    },
    scales: {
      x: {
        ticks: {
          color: tickColor,
        },
        grid: {
          color: gridColor,
        },
      },
      y: {
        ticks: {
          color: tickColor,
        },
        grid: {
          color: gridColor,
        },
      },
    },
  };
};

const getDoughnutOptions = (mode) => {
  const textColor = mode === 'dark' ? '#eeeeec' : '#111827';
  
  return {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
        },
      },
      title: {
        display: true,
        color: textColor,
      },
    },
  };
};

// ...existing code...
// This part was removed in the previous edit, ensuring the file ends correctly with the new exports
// The previous edit replaced the entire file content logic with the new functional components
// No further action needed here as the previous replace covered the exports.
// Wait, I need to make sure I didn't leave the old exports at the bottom if they were there.
// Let me check the file content again to be sure.


export function BarChart({ data, title }) {
  const { mode } = useTheme();
  const options = getChartOptions(mode);

  const chartData = {
    labels: data.labels || [],
    datasets: [
      {
        label: data.label || 'Dataset',
        data: data.values || [],
        backgroundColor: 'rgba(102, 126, 234, 0.5)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ 
      backgroundColor: 'var(--bg-secondary)', 
      border: '1px solid var(--border-color-strong)', 
      borderRadius: 'var(--radius-md)', 
      padding: 'var(--space-4)',
      transition: 'background 0.3s ease, border-color 0.3s ease'
    }}>
      <Bar data={chartData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: title } } }} />
    </div>
  );
}

export function LineChart({ data, title }) {
  const { mode } = useTheme();
  const options = getChartOptions(mode);

  const chartData = {
    labels: data.labels || [],
    datasets: [
      {
        label: data.label || 'Dataset',
        data: data.values || [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div style={{ 
      backgroundColor: 'var(--bg-secondary)', 
      border: '1px solid var(--border-color-strong)', 
      borderRadius: 'var(--radius-md)', 
      padding: 'var(--space-4)',
      transition: 'background 0.3s ease, border-color 0.3s ease'
    }}>
      <Line data={chartData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: title } } }} />
    </div>
  );
}

export function DoughnutChart({ data, title }) {
  const { mode } = useTheme();
  const options = getDoughnutOptions(mode);

  const chartData = {
    labels: data.labels || [],
    datasets: [
      {
        label: data.label || 'Dataset',
        data: data.values || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 205, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ 
      backgroundColor: 'var(--bg-secondary)', 
      border: '1px solid var(--border-color-strong)', 
      borderRadius: 'var(--radius-md)', 
      padding: 'var(--space-4)',
      transition: 'background 0.3s ease, border-color 0.3s ease'
    }}>
      <Doughnut data={chartData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: title } } }} />
    </div>
  );
}