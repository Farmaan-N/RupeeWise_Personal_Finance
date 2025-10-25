import React from 'react';

// Reusable card component for styling consistency
const FeatureCard = ({ icon, title, children }) => (
  <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
    <div className="text-3xl mb-3 text-cyan-600">{icon}</div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{children}</p>
  </div>
);

const Features = () => {
  return (
    <section id="features" className="py-20 bg-[#FAFAF5]"> {/* Light background for contrast */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need to Manage Your Finances
        </h2>
        
        {/* Responsive grid for feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <FeatureCard title="Expense Tracking">
            Log income and expenses, categorize transactions, and visualize your spending habits with clear charts.
          </FeatureCard>

          <FeatureCard title="Financial Calendar">
            Never miss a payment. Schedule reminders for EMIs, SIPs, bills, and other important dates.
          </FeatureCard>

          <FeatureCard title="AI Suggestion Bot">
            Get personalized, educational tips on reducing expenses and potential investment ideas based on your data. (Daily limit applies)
          </FeatureCard>
          
          <FeatureCard title="SIP Calculator">
            Estimate the future value of your Systematic Investment Plans based on investment amount, rate, and duration.
          </FeatureCard>

          <FeatureCard title="Gold/Silver Ratio">
            Track the real-time Gold to Silver price ratio to understand market trends.
          </FeatureCard>
          
          <FeatureCard title="Retirement Planner">
            Plan your retirement savings and goals with our easy-to-use calculator.
          </FeatureCard>

        </div>
      </div>
    </section>
  );
};

export default Features;