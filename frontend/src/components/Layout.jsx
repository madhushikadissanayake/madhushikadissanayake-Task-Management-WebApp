import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  PlusCircleIcon, 
  ChartPieIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Navigation items
  const navigationItems = [
    {
      name: 'Dashboard',
      icon: HomeIcon,
      path: '/dashboard',
      current: location.pathname === '/dashboard'
    },
    {
      name: 'Tasks',
      icon: ClipboardDocumentListIcon,
      path: '/tasks',
      current: location.pathname === '/tasks'
    },
    {
      name: 'Add Task',
      icon: PlusCircleIcon,
      path: '/tasks/add',
      current: location.pathname === '/tasks/add'
    }
  ];
  
  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gray-800">
          <div className="flex items-center justify-center h-16 px-4 bg-gray-900">
            <h1 className="text-xl font-bold text-white">Task Manager</h1>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon
                    className="flex-shrink-0 w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-300"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
            
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {user?.avatar ? (
                    <img
                      className="w-10 h-10 rounded-full"
                      src={user.avatar}
                      alt={user?.name}
                    />
                  ) : (
                    <UserCircleIcon className="w-10 h-10 text-gray-300" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs font-medium text-gray-300 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <button
                  onClick={logout}
                  className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar */}
      <div
        className={`${
          sidebarOpen ? 'fixed inset-0 z-40 flex md:hidden' : 'hidden'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"></div>
        <div className="relative flex flex-col flex-1 w-full max-w-xs bg-gray-800">
          <div className="absolute top-0 right-0 pt-2 -mr-12">
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="w-6 h-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-white">Task Manager</h1>
            </div>
            <nav className="px-2 mt-5 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className="flex-shrink-0 w-6 h-6 mr-4 text-gray-400 group-hover:text-gray-300"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 p-4 border-t border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {user?.avatar ? (
                  <img
                    className="w-10 h-10 rounded-full"
                    src={user.avatar}
                    alt={user?.name}
                  />
                ) : (
                  <UserCircleIcon className="w-10 h-10 text-gray-300" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs font-medium text-gray-300 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  logout();
                }}
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 w-14" aria-hidden="true">
          {/* Dummy element to force sidebar to shrink to fit close icon */}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="md:hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 sm:px-6 md:px-8">
            <h1 className="text-lg font-bold text-white">Task Manager</h1>
            <button
              type="button"
              className="text-gray-300 hover:text-white focus:outline-none"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
        </div>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-100 focus:outline-none">
          <div className="py-6">
            <div className="px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;