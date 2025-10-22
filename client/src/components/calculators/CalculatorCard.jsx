import React from 'react';

const CalculatorCard = ({ title, children, buttonText, onCalculate, result, onReset, isCalculateDisabled }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[500px]">
      {/* Fixed Header */}
      <h3 className="text-xl font-bold p-6 pb-4 text-gray-900">{title}</h3>
      
      {/* Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto px-6">
        <div className="space-y-4">
          {children}
        </div>
      </div>

      {/* Fixed Button Group */}
      <div className="p-6 pt-4 border-t border-gray-100 bg-white">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onReset}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Reset
          </button>
          <button
            onClick={onCalculate}
            disabled={isCalculateDisabled}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorCard;