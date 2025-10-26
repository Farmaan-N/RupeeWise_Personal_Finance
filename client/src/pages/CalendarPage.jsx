import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format, addMonths, subMonths } from 'date-fns';

import MonthHeader from '../components/calendar/MonthHeader';
import MonthGrid from '../components/calendar/MonthGrid';
import DayDrawer from '../components/calendar/DayDrawer';
import ReminderModal from '../components/ReminderModal';

const CalendarPage = () => {
  const [reminders, setReminders] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const { user } = useAuth();

  // --- Data Fetching ---
  const fetchReminders = async () => {
    if (!user?.token) return;
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    const { data } = await axios.get('http://localhost:5000/api/reminders', config);
    setReminders(data);
  };

  useEffect(() => {
    if (user) {
      fetchReminders();
    }
  }, [user]);

  // --- Data Processing (FIXED) ---
  const remindersByDate = useMemo(() => {
    const grouped = new Map();
    
    if (reminders && reminders.length > 0) {
      reminders.forEach(reminder => {
        const date = new Date(reminder.date);
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const correctedDate = new Date(date.getTime() + userTimezoneOffset);
        const dateKey = format(correctedDate, 'yyyy-MM-dd');
        
        if (!grouped.has(dateKey)) {
          grouped.set(dateKey, []);
        }
        grouped.get(dateKey).push(reminder);
      });
    }
    
    return grouped;
  }, [reminders]);


  // --- Event Handlers for CRUD ---
  const handleSaveReminder = async (reminderData) => {
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    if (reminderData._id) { // Update existing reminder
      await axios.put(`${import.meta.env.VITE_API_URL}/api/reminders/${reminderData._id}`, reminderData, config);
    } else { // Create new reminder
      await axios.post('http://localhost:5000/api/reminders', reminderData, config);
    }
    fetchReminders(); // Refresh the list
  };

  const handleDeleteReminder = async (id) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/reminders/${id}`, config);
      fetchReminders();
    }
  };

  // --- UI State Handlers ---
  const handleSelectDay = (day) => {
    setSelectedDate(day);
    setIsDrawerOpen(true);
  };

  const openAddModal = () => {
    const initialData = { date: format(selectedDate, 'yyyy-MM-dd') };
    setEditingReminder(initialData);
    setIsModalOpen(true);
  };

  const openEditModal = (reminder) => {
    setEditingReminder(reminder);
    setIsModalOpen(true);
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    // Updated page background and removed extra div
    <div className="bg-[#FAFAF5] p-4 sm:p-6 lg:p-8 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Financial Calendar</h1>
      <MonthHeader 
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
      <MonthGrid
        currentMonth={currentMonth}
        remindersByDate={remindersByDate}
        onSelectDay={handleSelectDay}
      />

      {/* Side Drawer */}
      <DayDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedDate={selectedDate}
        reminders={selectedDate ? remindersByDate.get(format(selectedDate, 'yyyy-MM-dd')) || [] : []}
        onAdd={openAddModal}
        onEdit={openEditModal}
        onDelete={handleDeleteReminder}
      />

      {/* Add/Edit Modal */}
      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReminder}
        reminderToEdit={editingReminder}
      />
    </div>
  );
};

export default CalendarPage;