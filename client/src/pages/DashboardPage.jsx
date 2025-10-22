import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TransactionForm from '../components/TransactionForm';
import SummaryCards from '../components/SummaryCards';
import ExpenseChart from '../components/ExpenseChart';
import AIChatbot from '../components/AIChatbot';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);

  // --- Data Fetching & Handlers ---
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user || !user.token) return;
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/transactions', config);
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch transactions', error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          logout(); navigate('/login');
        }
      }
    };
    fetchTransactions();
  }, [user, navigate, logout]);

  const onTransactionAdded = () => {
    const fetchTransactions = async () => {
        if (!user || !user.token) return;
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/transactions', config);
        setTransactions(data);
    };
    fetchTransactions();
  };

  // --- NEW: Function to handle transaction deletion ---
  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`http://localhost:5000/api/transactions/${id}`, config);
        // Refresh the transaction list by filtering out the deleted one for an instant UI update
        setTransactions(transactions.filter((t) => t._id !== id));
      } catch (error) {
        console.error('Failed to delete transaction', error);
        alert('Failed to delete transaction.');
      }
    }
  };
  // --- END: New function ---

  return (
    <div className="bg-[#FAFAF5] p-4 sm:p-6 lg:p-8 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Dashboard</h1>

      <SummaryCards transactions={transactions} />
      <TransactionForm onTransactionAdded={onTransactionAdded} />

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        <ExpenseChart transactions={transactions} />
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:w-2/3 flex flex-col h-[450px]">
          <h2 className="text-xl font-bold mb-4 text-gray-900 flex-shrink-0">Recent Transactions</h2>
          
          <div className="flex-grow overflow-y-auto pr-2">
            <ul className="divide-y divide-gray-200">
              {transactions.length === 0 && <p className="text-gray-500 text-center py-4">No transactions yet.</p>}
              {transactions.map((t) => (
                <li key={t._id} className="flex items-center justify-between py-3 px-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        {t.type === 'income' ? <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />}
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{t.category}</p>
                      <p className="text-sm text-gray-500">{new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>

                  {/* --- UPDATED: Wrapper for amount and delete button --- */}
                  <div className="flex items-center gap-4">
                    <span className={`font-bold text-base whitespace-nowrap ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                    </span>
                    {/* NEW: Delete Button */}
                    <button 
                      onClick={() => handleDeleteTransaction(t._id)} 
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete transaction"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.54 0c-.275.042-.547.085-.815.129m15.06 0a48.094 48.094 0 0 1-3.478-.397m-12.54 0a48.094 48.094 0 0 0-3.478.397m11.511 11.168v.003" />
                      </svg>
                    </button>
                  </div>
                  {/* --- END OF UPDATE --- */}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <AIChatbot />
    </div>
  );
};

export default DashboardPage;