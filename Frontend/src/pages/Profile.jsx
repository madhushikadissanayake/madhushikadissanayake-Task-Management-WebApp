import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('http://localhost:5000/api/user', { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => navigate('/')) // redirect to login if not authenticated
  }, [navigate])

  const handleLogout = async () => {
  try {
    await axios.get('http://localhost:5000/auth/logout', { withCredentials: true })
    window.location.href = '/' // redirect to login
  } catch (err) {
    console.error('Logout failed:', err)
  }
}


  if (!user) return <div className="p-6 text-center">Loading profile...</div>

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <p className="mb-2"><strong>Name:</strong> {user.name}</p>
      <p className="mb-6"><strong>Google ID:</strong> {user.googleId}</p>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  )
}

export default Profile
