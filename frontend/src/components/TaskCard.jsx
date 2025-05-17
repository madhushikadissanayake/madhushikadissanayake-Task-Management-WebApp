import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const TaskCard = ({ task, onToggleComplete, onDelete }) => {
  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task._id, task.completed)}
            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
          />
          <div className="ml-3">
            <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{task.description}</p>
          </div>
        </div>
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityColors[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
        </div>
        <div className="flex space-x-2">
          <Link
            to={`/tasks/edit/${task._id}`}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(task._id)}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;