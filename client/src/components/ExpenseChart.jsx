import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ transactions }) => {
  // --- NEW: Calculate total income to be used in the tooltip ---
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const chartData = {
    labels: Object.keys(expenseData),
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.values(expenseData),
        backgroundColor: [
          '#6366f1', // Indigo
          '#14b8a6', // Teal
          '#f59e0b', // Amber
          '#f43f5e', // Rose
          '#38bdf8', // Sky Blue
          '#84cc16', // Lime
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#4B5563',
        }
      },
      tooltip: {
        bodyColor: '#1F2937',
        titleColor: '#111827',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        // --- NEW: Custom Tooltip Callback ---
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            
            // Calculate the percentage of total income
            let percentage = 0;
            if (totalIncome > 0) {
              percentage = (value / totalIncome) * 100;
            }
            
            // Format the amount as currency
            const formattedValue = value.toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            });
            
            // Return the final string for the tooltip
            return `${label}: ${formattedValue} (${percentage.toFixed(1)}% of total income)`;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:w-1/3">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Expense Breakdown</h2>
      {Object.keys(expenseData).length === 0 ? (
         <p className="text-gray-500 text-center py-10">No expense data to display.</p>
      ) : (
         <Doughnut data={chartData} options={options} />
      )}
    </div>
  );
};

export default ExpenseChart;