import React, { useState } from 'react';
import toast from 'react-hot-toast';

const CreateTicket = ({ isOpen, onClose, onSubmit }) => {
  const [values, setValues] = useState({
    title: '',
    description: '',
    status: '', 
    priority: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const allowedStatuses = ["open", "in_progress", "closed"];
    const allowedPriorities = ["low", "medium", "high"];

    if (!values.title) newErrors.title = 'Title is mandatory.';
    
    if (!values.status) newErrors.status = 'Status is mandatory.'; 
    else if (!allowedStatuses.includes(values.status)) {
      newErrors.status = 'Status must be one of: open, in_progress, closed.';
    }
    
    if (!values.priority) newErrors.priority = 'Priority is mandatory.'; 
    else if (!allowedPriorities.includes(values.priority)) {
        newErrors.priority = 'Priority must be one of: low, medium, high.';
    }
    
    if (values.description && values.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(values); 
      setValues({ title: '', description: '', status: '', priority: '' });
    } else {
      toast.error('Please fix the form errors.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 p-4">
      <div className="bg-color-bg w-full max-w-lg p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-color-text">
          Create New Ticket
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg font-medium mb-2" htmlFor="title">Title *</label>
            <input 
              type="text" 
              id="title"
              name="title"
              value={values.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-color-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-lg font-medium mb-2" htmlFor="description">Description</label>
            <textarea 
              id="description"
              name="description"
              rows="3"
              value={values.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-color-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-medium mb-2" htmlFor="status">Status *</label>
              <select 
                id="status"
                name="status"
                value={values.status}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-color-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary `}
              >
                <option value="" disabled>Select a status</option> 
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-lg font-medium mb-2" htmlFor="priority">Priority *</label>
              <select 
                id="priority"
                name="priority"
                value={values.priority}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-color-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary`}
              >
                <option value="" disabled>Select a priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority}</p>}
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-color-primary text-white rounded-lg font-semibold hover:opacity-80"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;