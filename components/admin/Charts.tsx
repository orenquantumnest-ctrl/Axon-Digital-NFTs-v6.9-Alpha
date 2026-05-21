'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Bar, Line, Pie, Radar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Title,
  Tooltip,
  Legend
);

const defaultOptions: ChartOptions<any> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      backgroundColor: '#0a0a0a',
      titleColor: '#f8fafc',
      bodyColor: '#cbd5e1',
      borderColor: '#1e293b',
      borderWidth: 1,
      padding: 12,
      callbacks: {
        title: (context: any) => {
          return `Date: ${context[0].label}`;
        },
        label: (context: any) => {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null && context.parsed.y !== undefined) {
            label += context.parsed.y;
          } else if (context.parsed.r !== null && context.parsed.r !== undefined) {
             label += context.parsed.r; // Handle Radar chart
          } else {
             label += context.parsed; // Handle Pie/Doughnut charts
          }
          return label;
        },
        afterLabel: (context: any) => {
          // Add mock related info
          const randomTxId = Math.random().toString(36).substr(2, 9).toUpperCase();
          const randomUserId = Math.floor(Math.random() * 1000);
          return [`Transaction ID: TX-${randomTxId}`, `User ID: USR-${randomUserId}`];
        }
      }
    }
  }
};

export const BarChart = ({ data, options }: { data: any, options?: ChartOptions<'bar'> }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  if (!mounted) return <div className="w-full h-full bg-[#121212]/30 animate-pulse rounded-2xl" />;
  return <Bar data={data} options={options || defaultOptions} />;
};

export const LineChart = ({ data, options }: { data: any, options?: ChartOptions<'line'> }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  if (!mounted) return <div className="w-full h-full bg-[#121212]/30 animate-pulse rounded-2xl" />;
  return <Line data={data} options={options || defaultOptions} />;
};

export const PieChart = ({ data, options }: { data: any, options?: ChartOptions<'pie'> }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  if (!mounted) return <div className="w-full h-full bg-[#121212]/30 animate-pulse rounded-2xl" />;
  return <Pie data={data} options={options || { responsive: true }} />;
};

export const RadarChart = ({ data, options }: { data: any, options?: ChartOptions<'radar'> }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  if (!mounted) return <div className="w-full h-full bg-[#121212]/30 animate-pulse rounded-2xl" />;
  return <Radar data={data} options={options || { responsive: true }} />;
};

export const DoughnutChart = ({ data, options }: { data: any, options?: ChartOptions<'doughnut'> }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  if (!mounted) return <div className="w-full h-full bg-[#121212]/30 animate-pulse rounded-2xl" />;
  return <Doughnut data={data} options={options || { responsive: true }} />;
};
