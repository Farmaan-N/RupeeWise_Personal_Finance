import React from 'react';

const SummaryCard = ({ title, amount, colorClass }) => (
  // Updated card styles: white background, light border, shadow
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-transform transform hover:-translate-y-1 cursor-pointer">
    {/* Updated text colors */}
    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
    <p className={`text-3xl font-bold mt-1 ${colorClass}`}>₹{amount.toLocaleString('en-IN')}</p>
  </div>
);

const SummaryCards = ({ transactions }) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> {/* Increased gap */}
      <SummaryCard title="Total Income" amount={totalIncome} colorClass="text-green-600" />
      <SummaryCard title="Total Expenses" amount={totalExpenses} colorClass="text-red-600" />
      {/* Updated Balance colors */}
      <SummaryCard title="Balance" amount={balance} colorClass={balance >= 0 ? 'text-gray-900' : 'text-red-600'} />
    </div>
  );
};

export default SummaryCards;