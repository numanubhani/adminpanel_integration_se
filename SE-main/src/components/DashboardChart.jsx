import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

export default function DashboardChart({ timeframe }) {
  const labels = timeframe === "daily"
    ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
    : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Contributors',
        data: timeframe === "daily" ? [2,3,5,1,4,2,3] : [20,15,30,25],
        backgroundColor: '#ceb46a'
      },
      {
        label: 'Users',
        data: timeframe === "daily" ? [4,6,3,7,5,8,4] : [40,35,55,45],
        backgroundColor: '#f3f3f3ff'
      },
      {
        label: 'Wallet Deposits ($)',
        data: timeframe === "daily" ? [200,350,150,300,400,250,180] : [3000,4500,2500,3500],
        backgroundColor: '#4caf50'
      },
      {
        label: 'Content Flags',
        data: timeframe === "daily" ? [1,2,1,3,2,0,2] : [5,9,7,12],
        backgroundColor: '#f44336'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: { legend: { labels: { color: 'white' } } },
    scales: {
      x: { ticks: { color: 'white' } },
      y: { ticks: { color: 'white' } }
    }
  };

  return (
    <div className="bg-[#1c1c1e] border border-[#ceb46a] p-4 rounded-md shadow-md">
      <h4 className="text-white text-lg mb-4">
        {timeframe === "daily" ? "Daily Metrics" : "Weekly Metrics"}
      </h4>
      <Bar data={data} options={options} />
    </div>
  );
}
