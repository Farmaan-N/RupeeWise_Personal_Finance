import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TransactionForm = ({ onTransactionAdded }) => {
  const { user } = useAuth();
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const transactionData = { type, category, amount: Number(amount), date };
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/transactions`, transactionData, config);
      onTransactionAdded();
      setCategory(''); setAmount(''); setType('expense'); setDate(new Date().toISOString().slice(0, 10)); // Reset form fully
    } catch (error) {
      console.error('Error adding transaction', error.response?.data);
      alert(error.response?.data?.message || "Failed to add transaction"); // Simple feedback
    }
  };

  return (
    // Updated card styles
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <h3 className="text-xl text-gray-900 font-bold mb-4">Add New Transaction</h3>
      {/* Updated responsive grid and input/select styles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div className="lg:col-span-1">
          <label className="block text-gray-600 mb-1 text-sm font-medium" htmlFor="date">Date</label>
          <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" required />
        </div>
         <div className="lg:col-span-1">
           <label className="block text-gray-600 mb-1 text-sm font-medium" htmlFor="category">Category</label>
           <input id="category" type="text" placeholder="e.g., Food, Salary" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" required />
         </div>
         <div className="lg:col-span-1">
           <label className="block text-gray-600 mb-1 text-sm font-medium" htmlFor="amount">Amount (₹)</label>
           <input id="amount" type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" required />
         </div>
         <div className="lg:col-span-1">
            <label className="block text-gray-600 mb-1 text-sm font-medium" htmlFor="type">Type</label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
            </select>
         </div>
        <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md h-12">Add</button> {/* Adjusted padding/height */}
      </div>
    </form>
  );
};

export default TransactionForm;