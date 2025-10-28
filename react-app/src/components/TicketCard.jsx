import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const statusStyles = {
  open: 'bg-color-open text-green-800 border-green-200',
  in_progress: 'bg-color-progress text-yellow-800 border-yellow-200',
  closed: 'bg-color-closed text-gray-800 border-gray-200',
};

const priorityStyles = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200',
};

const TicketCard = ({ ticket, onEdit, onDelete }) => {
  const statusClass = statusStyles[ticket.status] || statusStyles['closed'];
  const priorityClass = priorityStyles[ticket.priority] || priorityStyles['low'];

  const timeAgo = ticket.createdAt 
    ? formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })
    : 'just now';

  return (
    <div className="bg-color-card p-6 rounded-2xl shadow-lg flex flex-col justify-between h-full">
      <div>
        <h3 className="text-2xl font-semibold text-color-text mb-3">{ticket.title}</h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
          <span 
            className={`px-3 py-1 text-xs font-bold rounded-full capitalize border ${statusClass}`}
          >
            {ticket.status.replace('_', ' ')}
          </span>
          <span 
            className={`px-3 py-1 text-xs font-bold rounded-full capitalize border ${priorityClass}`}
          >
            {ticket.priority || 'low'}
          </span>
          <span className="text-sm text-gray-500">{timeAgo}</span>
        </div>
        
        <p className="text-color-text mb-6 break-words">
          {ticket.description || 'No description provided.'}
        </p>
      </div>
      
      <div className="flex justify-end gap-4 border-t border-gray-200 pt-4">
        <button 
          onClick={onEdit}
          className="font-medium text-color-primary hover:text-color-secondary focus:outline-none focus:ring-2 focus:ring-color-primary rounded px-2"
        >
          Edit
        </button>
        <button 
          onClick={onDelete}
          className="font-medium text-statusGray hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TicketCard;