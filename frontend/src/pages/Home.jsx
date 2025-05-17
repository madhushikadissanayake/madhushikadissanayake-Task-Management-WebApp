// src/pages/Home.jsx
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-6">
            Task Management System
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Streamline your workflow, manage tasks efficiently, and boost productivity with our
            powerful task management platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/login"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-300"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-medium border border-indigo-200 hover:bg-indigo-50 transition duration-300"
            >
              Learn More
            </a>
          </div>
        </div>

        <div id="features" className="mt-24">
          <h2 className="text-3xl font-bold text-center text-indigo-800 mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-indigo-600 text-3xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Task Management</h3>
              <p className="text-gray-600">
                Create, edit, and organize tasks with ease. Track progress and manage deadlines efficiently.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-indigo-600 text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Dashboard Analytics</h3>
              <p className="text-gray-600">
                Get a quick overview of your tasks status, deadlines, and progress with visual dashboards.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-indigo-600 text-3xl mb-4">📑</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">PDF Reports</h3>
              <p className="text-gray-600">
                Generate and download comprehensive PDF reports of tasks for documentation and sharing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;