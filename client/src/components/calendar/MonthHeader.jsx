import React from 'react';
import { format } from 'date-fns';

const MonthHeader = ({ currentMonth, onPrevMonth, onNextMonth }) => {
  return (
    // Updated text and hover colors
    <div className="flex items-center justify-center mb-4 text-gray-900">
      <button onClick={onPrevMonth} className="p-2 rounded-full hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors" aria-label="Previous month">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>
      <h2 className="text-xl font-bold w-48 text-center">{format(currentMonth, 'MMMM yyyy')}</h2>
      <button onClick={onNextMonth} className="p-2 rounded-full hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors" aria-label="Next month">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
};

export default MonthHeader;