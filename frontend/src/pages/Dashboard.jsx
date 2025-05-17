import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api.service';
import { FaTasks, FaClock, FaCheckCircle, FaSpinner, FaPlus, FaListUl, FaFilePdf } from 'react-icons/fa';
import { downloadTasksPDF } from '../services/pdf.service';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [taskSummary, setTaskSummary] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await api.get('/tasks');

        if (!Array.isArray(response.data)) {
          throw new Error('Unexpected response format: expected an array of tasks');
        }

        setTasks(response.data);

        const total = response.data.length;
        const pending = response.data.filter(task => task.status === 'Pending').length;
        const inProgress = response.data.filter(task => task.status === 'In Progress').length;
        const completed = response.data.filter(task => task.status === 'Done').length;

        setTaskSummary({
          total,
          pending,
          inProgress,
          completed
        });

        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const upcoming = response.data
          .filter(task => {
            const deadline = new Date(task.deadline);
            return deadline >= today && deadline <= nextWeek && task.status !== 'Done';
          })
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
          .slice(0, 5);

        setUpcomingDeadlines(upcoming);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDownloadPDF = () => {
    downloadTasksPDF(tasks, currentUser);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  // The rest of the JSX remains unchanged (rendering dashboard content)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... unchanged JSX code ... */}
    </div>
  );
};

export default Dashboard;