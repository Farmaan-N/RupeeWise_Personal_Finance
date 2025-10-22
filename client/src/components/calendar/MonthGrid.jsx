import React from 'react';
import { eachDayOfInterval, endOfMonth, endOfWeek, startOfMonth, startOfWeek, format } from 'date-fns';
import DayCell from './DayCell';

const MonthGrid = ({ currentMonth, remindersByDate, onSelectDay }) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    // Updated grid background and border colors
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      {/* Updated header text color */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 uppercase font-semibold">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="py-2">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 border-t border-gray-200">
        {days.map((day) => (
          <DayCell
            key={day.toString()}
            day={day}
            currentMonth={currentMonth}
            reminders={remindersByDate.get(format(day, 'yyyy-MM-dd')) || []}
            onSelect={onSelectDay}
          />
        ))}
      </div>
    </div>
  );
};

export default MonthGrid;