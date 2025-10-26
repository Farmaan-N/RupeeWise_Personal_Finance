import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Trying another path

const AIChatbot = () => {
  const { user, login } = useAuth();
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Reverted to the simpler promptsUsed logic
  const promptsUsed = user?.promptCount || 0;
  const canAsk = promptsUsed < 5;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !canAsk || loading) return;

    const userMessage = { role: "user", content: input };
    const newHistory = [...history, userMessage];

    setHistory(newHistory); setInput(''); setLoading(true);

    // Using the exact try/catch logic you provided
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data: aiMessage } = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/chat`, { history: newHistory }, config);
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
    // --- STYLING CHANGES APPLIED AS REQUESTED ---
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 mt-8 flex flex-col h-[70vh] max-h-[700px]">
      {/* New header with title and prompt count */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">FinBot Assistant</h2>
        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {/* Using promptsUsed from your logic */
          }
          {5 - promptsUsed} / 5 Left
        </span>
      </div>

      {/* Updated chat history container */
      }
      <div className="flex-grow h-64 overflow-y-auto bg-gray-50 border border-gray-200 p-4 rounded-md mb-4 space-y-4">
        {/* New Welcome Message */
        }
        {history.length === 0 && !loading && (
          <div className="text-center text-gray-500 h-full flex flex-col justify-center items-center">
            <p className="font-medium">Welcome to FinBot!</p>
            <p className="text-sm">Ask me for financial insights based on your data.</p>
            <p className="text-sm mt-2 p-2 bg-gray-100 rounded-md">e.g., "How can I improve my savings?"</p>
          </div>
        )}

        {/* Your existing history.map logic */
        }
        {history.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-lg shadow-sm ${msg.role === 'user' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && <p className="text-gray-500 text-sm">FinBot is thinking...</p>}
      </div>

      {/* Your existing form logic */
      }
      <form onSubmit={handleSubmit}>
        <fieldset disabled={!canAsk || loading}>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              // Using your requested placeholder format with the correct variable
              placeholder={canAsk ? `Ask a question ` : "Daily limit reached."}
              className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            />
            <button
              type="submit"
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


