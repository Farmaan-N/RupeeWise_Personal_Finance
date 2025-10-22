import React from 'react';
import { isToday, isSameMonth } from 'date-fns';

const DayCell = ({ day, reminders, onSelect, currentMonth }) => {
  const isCurrentMonth = isSameMonth(day, currentMonth);
  const isCurrentDay = isToday(day);
  const remindersToShow = reminders.slice(0, 2);
  const hiddenRemindersCount = reminders.length - 2;

  return (
    // Updated border, hover, and text colors
    <div
      className={`relative h-20 md:h-24 p-2 border-b border-r border-gray-200 hover:bg-gray-100 transition cursor-pointer flex flex-col ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'text-gray-900'}`}
      onClick={() => onSelect(day)}
    >
      {/* Updated 'today' indicator color */}
      <span className={`self-end text-sm ${isCurrentDay ? 'bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
        {day.getDate()}
      </span>
      <div className="flex-grow overflow-hidden mt-1">
        {remindersToShow.map(reminder => (
          // Updated reminder chip colors
          <span key={reminder._id} className="block text-[11px] truncate rounded px-1 py-0.5 mt-1 bg-red-100 text-red-800 font-medium">
            {reminder.title}
          </span>
        ))}
        {hiddenRemindersCount > 0 && (
          // Updated '+ more' text color
          <span className="block text-[11px] text-gray-500 mt-1">
            +{hiddenRemindersCount} more
          </span>
        )}
      </div>
    </div>
  );
};

export default DayCell;