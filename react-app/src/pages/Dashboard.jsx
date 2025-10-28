import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import CreateTicket from '../components/CreateTicket';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, open: 0, in_progress: 0, closed: 0 });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token, handleApiError } = useAuth();
  
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!token) return; 

    try {
      setLoading(true);
      const tickets = await api.getTickets(token); 
      
      const sortedTickets = [...tickets].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentTickets(sortedTickets.slice(0, 5));

      const newStats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        in_progress: tickets.filter(t => t.status === 'in_progress').length,
        closed: tickets.filter(t => t.status === 'closed').length,
      };
      setStats(newStats);
    } catch (error) {
      handleApiError(error, 'Failed to load dashboard. Please retry.');
    } finally {
      setLoading(false);
    }
  }, [token, handleApiError]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleOpenCreate = () => setIsCreateTicketOpen(true);
  const handleCloseModal = () => setIsCreateTicketOpen(false);

  const handleCreateSubmit = async (formData) => {
    try {
      const newTicketData = { ...formData, userId: user.id };
      await api.createTicket(newTicketData, token);
      toast.success('Ticket created successfully!');
      fetchStats();
      handleCloseModal();
    } catch (error) {
      handleApiError(error, 'Failed to create ticket. Please retry.');
    }
  };

  const pieData = useMemo(() => [
    { name: 'Open', value: stats.open },
    { name: 'In Progress', value: stats.in_progress },
    { name: 'Closed', value: stats.closed },
  ], [stats]);

  const COLORS = {
    open: '#34d399',
    in_progress: '#f59e0b',
    closed: '#6b7280',
  };

  const StatCard = ({ title, value, colorClass }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
      <h3 className={`text-5xl font-bold ${colorClass || 'text-color-text'}`}>{value}</h3>
      <p className="text-xl text-color-text mt-2">{title}</p>
    </div>
  );

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <h1 className="text-5xl font-bold text-color-text">Dashboard</h1>
        <button
          onClick={handleOpenCreate}
          className="px-6 py-3 bg-color-primary text-white rounded-lg font-semibold hover:opacity-80 w-full md:w-auto"
        >
          Create New Ticket
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center">
          
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-2xl font-semibold text-color-text">Ticket Status</h2>
            <p className="text-6xl font-bold text-color-text mt-4">{stats.total}</p>
            <p className="text-xl text-color-text">Total Tickets</p>
          </div>
          
          <div style={{ width: 200, height: 150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell key="cell-0" fill={COLORS.open} />
                  <Cell key="cell-An" fill={COLORS.in_progress} />
                  <Cell key="cell-2" fill={COLORS.closed} />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Open" value={stats.open} colorClass="text-color-open" />
        <StatCard title="In Progress" value={stats.in_progress} colorClass="text-color-progress" />
        <StatCard title="Closed" value={stats.closed} colorClass="text-color-closed" />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-color-text">Recent Tickets</h2>
        <div className="space-y-4">
          {recentTickets.length > 0 ? (
            recentTickets.map(ticket => (
              <div key={ticket.id} className="border-b border-gray-200 pb-3 last:border-b-0">
                <Link to="/tickets" className="font-semibold text-color-primary hover:underline">
                  {ticket.title}
                </Link>
                <p className="text-sm text-gray-500">
                  Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                </p>
              </div>
            ))
          ) : (
            <p className="text-color-text">No recent tickets.</p>
          )}
        </div>
      </div>

      <CreateTicket 
        isOpen={isCreateTicketOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
};

export default Dashboard;