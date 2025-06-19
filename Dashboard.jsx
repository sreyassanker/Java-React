import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/attendance_dashboard.json')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error('Error loading data:', error));
  }, []);

  if (!data) return <div className="loading">Loading dashboard...</div>;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          font: {
            size: 10
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 10
          }
        }
      },
      y: {
        ticks: {
          font: {
            size: 10
          }
        }
      }
    }
  };

  return (
    <div className="dashboard compact">
      <h1>Attendance Dashboard</h1>

      {/* Summary Cards */}
      <div className="summary-cards compact">
        <div className="card">
          <h3>Total Workforce</h3>
          <p className="value">{data.summary.total_enrolled.toLocaleString()}</p>
          <p className="change positive">+5% vs last week</p>
        </div>

        <div className="card">
          <h3>Absence Rate</h3>
          <p className="value">{data.summary.absence_rate}%</p>
          <p className="change negative">-1.2% vs last week</p>
        </div>

        <div className="card">
          <h3>On-Site Workforce</h3>
          <p className="value">{data.summary.total_present.toLocaleString()}</p>
          <p className="change positive">+3% vs last week</p>
        </div>
      </div>

      {/* Daily Line Chart */}
      <div className="chart-row compact">
        <div className="chart-container">
          <h3>Daily Trends</h3>
          <div className="chart-wrapper small">
            <Line
              data={{
                labels: data.daily_trends.labels.map((d) => new Date(d).toLocaleDateString()),
                datasets: data.daily_trends.datasets.map((ds) => ({
                  ...ds,
                  borderWidth: 1.5,
                  pointRadius: 2
                }))
              }}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  tooltip: {
                    bodyFont: { size: 10 },
                    titleFont: { size: 10 }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Site Charts: Side by Side */}
      <div className="chart-row compact" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        {/* Site Attendance - Bar */}
        <div className="chart-container" style={{ flex: 1 }}>
          <h3>Site Attendance</h3>
          <div className="chart-wrapper small">
            <Bar data={data.site_attendance} options={chartOptions} />
          </div>
        </div>

        {/* Site Distribution - Pie */}
        <div className="chart-container" style={{ flex: 1.3 }}>
          <h3>Site Distribution</h3>
          <div className="chart-wrapper small">
            <Pie
              data={data.site_distribution}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    ...chartOptions.plugins.legend,
                    position: 'right'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
