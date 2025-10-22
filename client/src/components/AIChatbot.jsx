import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AIChatbot = () => {
  const { user, login } = useAuth();
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const promptsUsed = user?.promptCount || 0;
  const canAsk = promptsUsed < 5;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !canAsk || loading) return;

    const userMessage = { role: "user", content: input };
    const newHistory = [...history, userMessage];

    setHistory(newHistory); setInput(''); setLoading(true);

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data: aiMessage } = await axios.post('http://localhost:5000/api/ai/chat', { history: newHistory }, config);
      setHistory(prev => [...prev, aiMessage]);
      const updatedUser = { ...user, promptCount: promptsUsed + 1 };
      login(updatedUser);
    } catch (error) {
      console.error("Chatbot error:", error);
      if (error.response && error.response.status === 429) {
        const limitMessage = { role: "assistant", content: error.response.data.message };
        setHistory(prev => [...prev, limitMessage]);
        const updatedUser = { ...user, promptCount: 5 };
        login(updatedUser);
      } else {
        const errorMessage = { role: "assistant", content: "Sorry, I couldn't get a response." };
        setHistory(prev => [...prev, errorMessage]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Updated card styles
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-8">
      {/* Updated text colors */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">FinBot Assistant</h2>
      {/* Updated chat history background */}
      <div className="h-64 overflow-y-auto bg-gray-50 border border-gray-200 p-4 rounded-md mb-4 space-y-4">
        {history.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {/* Updated bubble colors */}
            <div className={`max-w-[80%] px-4 py-2 rounded-lg shadow-sm ${msg.role === 'user' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && <p className="text-gray-500 text-sm">FinBot is thinking...</p>}
      </div>

      <form onSubmit={handleSubmit}>
        <fieldset disabled={!canAsk || loading}>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={canAsk ? `Ask a question... (${5 - promptsUsed} left)` : "Daily limit reached."}
              // Updated input styles
              className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            />
            <button
              type="submit"
              // Updated button styles
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default AIChatbot;