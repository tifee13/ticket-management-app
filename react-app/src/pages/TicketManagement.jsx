import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext'; 
import TicketCard from '../components/TicketCard';
import CreateTicket from '../components/CreateTicket';
import EditTicket from '../components/EditTicket';
import toast from 'react-hot-toast';

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [isEditTicketOpen, setIsEditTicketOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  
  const { user, token } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchTickets = useCallback(async () => {
    if (!token) return; 
    try {
      setLoading(true);
      const data = await api.getTickets(token); 
      setTickets(data);
    } catch (error) {
      toast.error('Failed to load tickets.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const filteredTickets = useMemo(() => {
    return tickets
      .filter(ticket => {
        if (statusFilter === 'all') return true;
        return ticket.status === statusFilter;
      })
      .filter(ticket => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          ticket.title.toLowerCase().includes(searchTermLower) ||
          ticket.description.toLowerCase().includes(searchTermLower)
        );
      });
  }, [tickets, searchTerm, statusFilter]);

  const handleOpenCreate = () => {
    setIsCreateTicketOpen(true);
  };

  const handleOpenEdit = (ticket) => {
    setCurrentTicket(ticket);
    setIsEditTicketOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateTicketOpen(false);
    setIsEditTicketOpen(false);
    setCurrentTicket(null);
  };

  const handleDelete = async (ticketId) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await api.deleteTicket(ticketId, token);
        toast.success('Ticket deleted!');
        fetchTickets(); 
      } catch (error) {
        toast.error(error.message || 'Failed to delete ticket.');
      }
    }
  };

  const handleCreateSubmit = async (formData) => {
    try {
      const newTicketData = { ...formData, userId: user.id };
      await api.createTicket(newTicketData, token);
      
      toast.success('Ticket created successfully!');
      fetchTickets();
      handleCloseModal();
    } catch (error) {
      toast.error(error.message || 'Failed to create ticket.');
    }
  };
  
  const handleUpdateSubmit = async (formData) => {
    try {
      await api.updateTicket(formData.id, formData, token);
      
      toast.success('Ticket updated successfully!');
      fetchTickets();
      handleCloseModal();
    } catch (error) {
      toast.error(error.message || 'Failed to update ticket.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <h1 className="text-5xl font-bold text-color-text">Manage Tickets</h1>
        <button
          onClick={handleOpenCreate}
          className="px-6 py-3 bg-color-primary text-color-card rounded-lg font-semibold hover:opacity-80 w-full md:w-auto"
        >
          Create New Ticket
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-4 bg-color-card rounded-lg shadow">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">Search Tickets</label>
          <input
            type="text"
            id="search"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-color-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary"
          />
        </div>
        <div className="w-full md:w-1/4">
          <label htmlFor="statusFilter" className="sr-only">Filter by Status</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 border border-color-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading tickets...</p>
      ) : (
        <>
          {filteredTickets.length === 0 ? (
            <p className="text-center text-lg text-gray-500 py-10">
              No tickets found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTickets.map(ticket => (
                <TicketCard 
                  key={ticket.id} 
                  ticket={ticket} 
                  onEdit={() => handleOpenEdit(ticket)}
                  onDelete={() => handleDelete(ticket.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

        <CreateTicket 
          isOpen={isCreateTicketOpen}
          onClose={handleCloseModal}
          onSubmit={handleCreateSubmit}
        />
      { currentTicket && (
        <EditTicket 
          isOpen={isEditTicketOpen}
          onClose={handleCloseModal}
          onSubmit={handleUpdateSubmit}
          ticketToEdit={currentTicket}
        />
      )}
    </div>
  );
};

export default TicketManagement;