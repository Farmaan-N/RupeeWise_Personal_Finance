import React, { useState, useEffect, useRef } from 'react';
import FocusTrap from 'focus-trap-react';

const ReminderModal = ({ isOpen, onClose, onSave, reminderToEdit }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('Bill');
  const inputRef = useRef(null); // Ref for the first input field

  useEffect(() => {
    if (isOpen) {
      if (reminderToEdit) {
        setTitle(reminderToEdit.title || '');
        setDate(reminderToEdit.date ? new Date(reminderToEdit.date).toISOString().slice(0, 10) : '');
        setType(reminderToEdit.type || 'Bill');
      } else {
        setTitle('');
        setDate('');
        setType('Bill');
      }
      
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = 'auto';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [reminderToEdit, isOpen, onClose]);


  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ ...reminderToEdit, title, date, type });
    onClose();
  };

  return (
    <FocusTrap active={isOpen}>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        {/* Updated dialog styles to light theme */}
        <div 
          className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold mb-4 text-gray-900">
            {reminderToEdit && reminderToEdit._id ? 'Edit Reminder' : 'Add New Reminder'}
          </h3>
          
          <div className="space-y-4">
            {/* Updated input styles for light theme */}
            <input 
              ref={inputRef}
              type="text" 
              placeholder="Reminder Title" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" 
              required 
            />
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" 
              required 
            />
            <select 
              value={type} 
              onChange={e => setType(e.target.value)} 
              className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option>Bill</option>
              <option>EMI</option>
              <option>SIP</option>
              <option>Other</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-4 mt-6">
            {/* Updated button styles */}
            <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md">Cancel</button>
            <button onClick={handleSave} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">Save</button>
          </div>
        </div>
      </div>
    </FocusTrap>
  );
};

export default ReminderModal;
