import React from 'react';
import { format } from 'date-fns';

const DayDrawer = ({ selectedDate, reminders, isOpen, onClose, onAdd, onEdit, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* Keep overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      {/* Update drawer background, text, borders */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          {/* Update text colors */}
          <h3 className="text-lg font-bold text-gray-900">{selectedDate ? format(selectedDate, 'PPP') : 'Select a Date'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        <div className="p-4">
          <button
            onClick={onAdd}
            // Update button color to red
            className="w-full mb-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md"
          >
            + Add Reminder for this Day
          </button>
          <div className="space-y-3 overflow-y-auto h-[calc(100vh-140px)]">
            {reminders.length > 0 ? (
              reminders.map(r => (
                // Update reminder item styles
                <div key={r._id} className="bg-gray-100 p-3 rounded-md flex justify-between items-center border border-gray-200">
                  <div>
                    <p className="font-semibold text-gray-900">{r.title}</p>
                    {/* Update type badge color */}
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">{r.type}</span>
                  </div>
                  <div className="flex gap-3">
                    {/* Update icon button colors */}
                    <button onClick={() => onEdit(r)} className="text-gray-500 hover:text-gray-800 cursor-pointer transition-transform hover:scale-110" title="Edit">✏️</button>
                    <button onClick={() => onDelete(r._id)} className="text-gray-500 hover:text-red-600 cursor-pointer transition-transform hover:scale-110" title="Delete">🗑️</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center mt-4">No reminders for this day.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayDrawer;