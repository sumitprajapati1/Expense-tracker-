import React, { useContext } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ExpenseContext from '../context/ExpenseContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseSummary = () => {
  const { summary, loading, error, currentMonth, exportExpenses } = useContext(ExpenseContext);

  if (loading) {
    return <div className="text-center py-4">Loading summary...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (summary.length === 0) {
    return null;
  }

  const data = {
    labels: summary.map((item) => item._id),
    datasets: [
      {
        data: summary.map((item) => item.total),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#8AC24A',
          '#607D8B',
          '#E91E63'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#8AC24A',
          '#607D8B',
          '#E91E63'
        ]
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        position: 'right'
      }
    }
  };

  const total = summary.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Monthly Summary</h2>
        <button
          onClick={() => exportExpenses()}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Export
        </button>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-medium">
          Total: <span className="font-bold">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="h-64">
        <Pie data={data} options={options} />
      </div>

      <div className="mt-4">
        <h3 className="font-medium mb-2">Category Breakdown</h3>
        <ul className="space-y-1">
          {summary.map((item) => (
            <li key={item._id} className="flex justify-between">
              <span>{item._id}</span>
              <span className="font-medium">
                ${item.total.toFixed(2)} ({(item.total / total * 100).toFixed(1)}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExpenseSummary;