import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">Page not found or you are not authorized to view this.</p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>
    </div>
  )
}

export default NotFound
