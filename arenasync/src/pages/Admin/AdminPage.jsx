import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './AdminPage.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

function AdminPage({ role, setRole }) {

  const navigate = useNavigate()

  // Which tab is currently open
  const [activeTab, setActiveTab] = useState('users')

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Block anyone who is not an Admin from seeing this page
  useEffect(function () {
    if (role !== 'Admin') {
      navigate('/')
    }
  }, [role, navigate])

  // Load all users when the page first opens
  useEffect(function () {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem('token')

        const res = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: 'Bearer ' + token }
        })
        setUsers(res.data)

      } catch (err) {
        setError('Could not load users.')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="admin-page">
        <Navbar role={role} setRole={setRole} />
        <div style={{ padding: 60, textAlign: 'center', color: '#6B7280' }}>Loading admin panel...</div>
      </div>
    )
  }

  return (
    <div className="admin-page">

      <Navbar role={role} setRole={setRole} />

      <div className="admin-content">

        <h1 className="admin-heading">Admin Panel</h1>
        <p className="admin-subheading">Manage users, matches, and venues</p>

        {error && (
          <p style={{ color: '#DC2626', marginBottom: 16 }}>{error}</p>
        )}

        {/* Tab navigation */}
        <div className="admin-tabs">
          <button
            className={activeTab === 'users' ? 'admin-tab-btn active' : 'admin-tab-btn'}
            onClick={function () { setActiveTab('users') }}
          >
            Users
          </button>
          <button
            className={activeTab === 'matches' ? 'admin-tab-btn active' : 'admin-tab-btn'}
            onClick={function () { setActiveTab('matches') }}
          >
            Matches
          </button>
          <button
            className={activeTab === 'venues' ? 'admin-tab-btn active' : 'admin-tab-btn'}
            onClick={function () { setActiveTab('venues') }}
          >
            Venues
          </button>
        </div>

        {/* Users tab */}
        {activeTab === 'users' && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map(function (u) {
                  return (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{u.status}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Matches tab placeholder */}
        {activeTab === 'matches' && (
          <p style={{ color: '#6B7280' }}>Matches tab coming next.</p>
        )}

        {/* Venues tab placeholder */}
        {activeTab === 'venues' && (
          <p style={{ color: '#6B7280' }}>Venues tab coming next.</p>
        )}

      </div>

      <Footer />

    </div>
  )
}

export default AdminPage