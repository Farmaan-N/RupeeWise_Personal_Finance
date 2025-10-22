import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // Default base styles
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const FinancialCalendar = () => {
  const [reminders, setReminders] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date());

  const { user } = useAuth();

  // Fetch reminders (no change in this function)
  const fetchReminders = async () => {
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    const { data } = await axios.get('http://localhost:5000/api/reminders', config);
    setReminders(data);
  };

  useEffect(() => {
    if (user) fetchReminders();
  }, [user]);

  // Find reminders for the selected day
  const remindersForSelectedDay = reminders.filter(reminder => 
    format(new Date(reminder.date), 'yyyy-MM-dd') === format(selectedDay, 'yyyy-MM-dd')
  );

  // Custom styling for days that have a reminder
  const daysWithReminders = reminders.map(r => new Date(r.date));
  const reminderStyle = { border: '2px solid #06b6d4' }; // cyan-500

  return (
    <div className="bg-gray-800 p-6 rounded-lg mt-8 flex flex-col md:flex-row gap-8">
      {/* Calendar Section */}
      <div className="flex-shrink-0 mx-auto">
        <DayPicker
          mode="single"
          selected={selectedDay}
          onSelect={setSelectedDay}
          modifiers={{ reminders: daysWithReminders }}
          modifiersStyles={{ reminders: reminderStyle }}
          className="bg-gray-900 p-4 rounded-md"
          classNames={{
            caption: 'flex justify-center items-center h-10',
            head_cell: 'w-10 h-10 font-semibold text-gray-400',
            cell: 'w-10 h-10',
            day: 'w-10 h-10 rounded-full transition-colors hover:bg-cyan-600/50',
            day_selected: 'bg-cyan-600 text-white',
            day_today: 'font-bold text-cyan-400',
          }}
        />
      </div>

      {/* Reminders List Section */}
      <div className="flex-grow">
        <h3 className="text-xl font-bold mb-4">
          Reminders for {format(selectedDay, 'PPP')}
        </h3>
        <div className="space-y-3">
          {remindersForSelectedDay.length > 0 ? (
            remindersForSelectedDay.map(reminder => (
              <div key={reminder._id} className="bg-gray-700 p-3 rounded-md">
                <p className="font-semibold text-white">[{reminder.type}] {reminder.title}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No reminders for this day.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialCalendar;