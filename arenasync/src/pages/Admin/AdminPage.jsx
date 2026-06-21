import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './AdminPage.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import IconUser from '../../components/icons/IconUser'
import IconCalendar from '../../components/icons/IconCalendar'
import IconBuilding from '../../components/icons/IconBuilding'

function AdminPage({ role, setRole }) {

  const navigate = useNavigate()

  const [activeSection, setActiveSection] = useState('users')

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

      <div className="admin-layout">

        {/* Sidebar */}
        <aside className="admin-sidebar">
          <button
            className={activeSection === 'users' ? 'admin-sidebar-btn active' : 'admin-sidebar-btn'}
            onClick={function () { setActiveSection('users') }}
          >
            <IconUser size={16} color={activeSection === 'users' ? '#16A34A' : '#6B7280'} />
            Users
          </button>
          <button
            className={activeSection === 'matches' ? 'admin-sidebar-btn active' : 'admin-sidebar-btn'}
            onClick={function () { setActiveSection('matches') }}
          >
            <IconCalendar size={16} color={activeSection === 'matches' ? '#16A34A' : '#6B7280'} />
            Matches
          </button>
          <button
            className={activeSection === 'venues' ? 'admin-sidebar-btn active' : 'admin-sidebar-btn'}
            onClick={function () { setActiveSection('venues') }}
          >
            <IconBuilding size={16} color={activeSection === 'venues' ? '#16A34A' : '#6B7280'} />
            Venues
          </button>
        </aside>

        {/* Main content */}
        <main className="admin-main">

          <h1 className="admin-heading">Admin Panel</h1>
          <p className="admin-subheading">Manage users, matches and venues</p>

          {error && (
            <p style={{ color: '#DC2626', marginBottom: 16 }}>{error}</p>
          )}

          {/* Users section */}
          {activeSection === 'users' && (
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

          {/* Matches section placeholder */}
          {activeSection === 'matches' && (
            <p style={{ color: '#6B7280' }}>Matches section coming next.</p>
          )}

          {/* Venues section placeholder */}
          {activeSection === 'venues' && (
            <p style={{ color: '#6B7280' }}>Venues section coming next.</p>
          )}

        </main>

      </div>

      <Footer />

    </div>
  )
}

export default AdminPage