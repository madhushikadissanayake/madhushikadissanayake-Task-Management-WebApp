import axios from '../axios';


const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <button
        className="bg-blue-600 text-white px-6 py-3 rounded-md"
        onClick={() => window.location.href = "http://localhost:5000/auth/google"}
      >
        Sign in with Google
      </button>
    </div>
  )
}

export default Login
