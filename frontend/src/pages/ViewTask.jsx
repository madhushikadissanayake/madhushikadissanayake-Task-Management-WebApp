import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api.service';
import { FaEdit, FaTrash, FaArrowLeft, FaCheck, FaClock, FaSpinner } from 'react-icons/fa';

const ViewTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/tasks/${id}`);
        setTask(response.data);
      } catch (err) {
        console.error('Error fetching task:', err);
        setError('Failed to load task details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        navigate('/tasks');
      } catch (err) {
        console.error('Error deleting task:', err);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  // Calculate days remaining or overdue
  const getDaysInfo = () => {
    if (!task) return null;
    
    const today = new Date();
    const deadline = new Date(task.deadline);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return { text: `${diffDays} days remaining`, color: 'text-blue-600' };
    } else if (diffDays === 0) {
      return { text: 'Due today', color: 'text-yellow-600' };
    } else {
      return { text: `${Math.abs(diffDays)} days overdue`, color: 'text-red-600' };
    }
  };

  // Get status icon and color
  const getStatusInfo = () => {
    if (!task) return null;
    
    switch (task.status) {
      case 'Done':
        return { 
          icon: <FaCheck className="mr-2" />, 
          bgColor: 'bg-green-100', 
          textColor: 'text-green-800' 
        };
      case 'In Progress':
        return { 
          icon: <FaSpinner className="mr-2" />, 
          bgColor: 'bg-yellow-100', 
          textColor: 'text-yellow-800' 
        };
      default:
        return { 
          icon: <FaClock className="mr-2" />, 
          bgColor: 'bg-red-100', 
          textColor: 'text-red-800' 
        };
    }
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

  if (!task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Task not found!</strong>
          <span className="block sm:inline"> The task you're looking for might have been deleted or doesn't exist.</span>
          <div className="mt-4">
            <Link to="/tasks" className="text-blue-600 hover:underline flex items-center">
              <FaArrowLeft className="mr-2" /> Back to Task List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const daysInfo = getDaysInfo();
  const statusInfo = getStatusInfo();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/tasks" className="text-blue-600 hover:underline flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Task List
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Task Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
            <div className="flex mt-4 md:mt-0 space-x-2">
              <Link
                to={`/tasks/edit/${id}`}
                className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded flex items-center"
              >
                <FaEdit className="mr-2" /> Edit
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center"
              >
                <FaTrash className="mr-2" /> Delete
              </button>
            </div>
          </div>
        </div>

        {/* Task Details */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Task Information</h2>
              
              <div className="mb-6">
                <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-1">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{task.description || 'No description provided.'}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-1">Assigned To</h3>
                <p className="text-gray-700">{task.assignedTo}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-1">Status</h3>
                <div className="flex items-center">
                  <span className={`px-3 py-1 inline-flex items-center text-sm font-semibold rounded-full ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                    {statusInfo.icon} {task.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Timeframe</h2>
              
              <div className="mb-6">
                <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-1">Created On</h3>
                <p className="text-gray-700">
                  {new Date(task.createdAt).toLocaleDateString()} at {new Date(task.createdAt).toLocaleTimeString()}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-1">Last Updated</h3>
                <p className="text-gray-700">
                  {new Date(task.updatedAt).toLocaleDateString()} at {new Date(task.updatedAt).toLocaleTimeString()}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-1">Deadline</h3>
                <p className="text-gray-700">
                  {new Date(task.deadline).toLocaleDateString()}
                </p>
                <p className={`${daysInfo.color} text-sm font-medium mt-1`}>
                  {daysInfo.text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTask;