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
    const [actionError, setActionError] = useState('')

    // Search and filter for the Users table
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('All')

    // The user currently open in the Edit modal (null = modal closed)
    const [editingUser, setEditingUser] = useState(null)
    const [editRole, setEditRole] = useState('')
    const [editStatus, setEditStatus] = useState('')

    // The user currently open in the Delete confirmation modal (null = closed)
    const [deletingUser, setDeletingUser] = useState(null)

    // Get the logged-in admin so we can hide Edit/Delete on their own row
    const storedUser = localStorage.getItem('user')
    const currentAdmin = storedUser ? JSON.parse(storedUser) : null

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

    // Apply search and role filter to the users list
    const filteredUsers = users.filter(function (u) {
        const search = searchTerm.toLowerCase()
        const matchesSearch =
            u.name.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search)

        const matchesRole = roleFilter === 'All' || u.role === roleFilter

        return matchesSearch && matchesRole
    })

    // Open the Edit modal pre-filled with this user's current role and status
    function openEditModal(user) {
        setEditingUser(user)
        setEditRole(user.role)
        setEditStatus(user.status)
        setActionError('')
    }

    // Save the role/status change to the backend
    async function handleSaveEdit() {
        try {
            const token = localStorage.getItem('token')

            const res = await axios.put(
                'http://localhost:5000/api/admin/users/' + editingUser._id,
                { role: editRole, status: editStatus },
                { headers: { Authorization: 'Bearer ' + token } }
            )

            // Replace the old version of this user in our list with the updated one
            setUsers(users.map(function (u) {
                return u._id === editingUser._id ? res.data : u
            }))

            setEditingUser(null)

        } catch (err) {
            setActionError('Could not update user.')
        }
    }

    // Delete the user from the backend and remove them from our list
    async function handleConfirmDelete() {
        try {
            const token = localStorage.getItem('token')

            await axios.delete(
                'http://localhost:5000/api/admin/users/' + deletingUser._id,
                { headers: { Authorization: 'Bearer ' + token } }
            )

            setUsers(users.filter(function (u) {
                return u._id !== deletingUser._id
            }))

            setDeletingUser(null)

        } catch (err) {
            setActionError('Could not delete user.')
        }
    }

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
                    <p className="admin-subheading">Manage users, matches, and venues</p>

                    {error && (
                        <p style={{ color: '#DC2626', marginBottom: 16 }}>{error}</p>
                    )}
                    {actionError && (
                        <p style={{ color: '#DC2626', marginBottom: 16 }}>{actionError}</p>
                    )}

                    {/* Users section */}
                    {activeSection === 'users' && (
                        <>
                            {/* Search bar and role filter */}
                            <div className="admin-toolbar">
                                <input
                                    type="text"
                                    className="admin-search-input"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={function (e) { setSearchTerm(e.target.value) }}
                                />
                                <select
                                    className="admin-filter-select"
                                    value={roleFilter}
                                    onChange={function (e) { setRoleFilter(e.target.value) }}
                                >
                                    <option value="All">All Roles</option>
                                    <option value="Player">Player</option>
                                    <option value="Organizer">Organizer</option>
                                    <option value="Venue Host">Venue Host</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>

                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map(function (u) {
                                            const isSelf = currentAdmin && u._id === currentAdmin.id

                                            return (
                                                <tr key={u._id}>
                                                    <td>
                                                        {u.name}
                                                        {isSelf && <span className="admin-you-label">(You)</span>}
                                                    </td>
                                                    <td>{u.email}</td>
                                                    <td>{u.role}</td>
                                                    <td>{u.status}</td>
                                                    <td>
                                                        {!isSelf && (
                                                            <>
                                                                <button
                                                                    className="admin-action-btn admin-action-edit"
                                                                    onClick={function () { openEditModal(u) }}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    className="admin-action-btn admin-action-delete"
                                                                    onClick={function () { setDeletingUser(u) }}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
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

            {/* Edit User modal */}
            {editingUser && (
                <div className="admin-modal-overlay" onClick={function () { setEditingUser(null) }}>
                    <div className="admin-modal-card" onClick={function (e) { e.stopPropagation() }}>
                        <h3 className="admin-modal-title">Edit {editingUser.name}</h3>

                        <label className="admin-modal-label">Role</label>
                        <select
                            className="admin-modal-select"
                            value={editRole}
                            onChange={function (e) { setEditRole(e.target.value) }}
                        >
                            <option value="Player">Player</option>
                            <option value="Organizer">Organizer</option>
                            <option value="Venue Host">Venue Host</option>
                            <option value="Admin">Admin</option>
                        </select>

                        <label className="admin-modal-label">Status</label>
                        <select
                            className="admin-modal-select"
                            value={editStatus}
                            onChange={function (e) { setEditStatus(e.target.value) }}
                        >
                            <option value="Active">Active</option>
                            <option value="Suspended">Suspended</option>
                        </select>

                        <div className="admin-modal-actions">
                            <button className="admin-modal-cancel-btn" onClick={function () { setEditingUser(null) }}>
                                Cancel
                            </button>
                            <button className="admin-modal-save-btn" onClick={handleSaveEdit}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete User confirmation modal */}
            {deletingUser && (
                <div className="admin-modal-overlay" onClick={function () { setDeletingUser(null) }}>
                    <div className="admin-modal-card" onClick={function (e) { e.stopPropagation() }}>
                        <h3 className="admin-modal-title">Delete {deletingUser.name}?</h3>
                        <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 20 }}>
                            This will permanently remove their account. This cannot be undone.
                        </p>

                        <div className="admin-modal-actions">
                            <button className="admin-modal-cancel-btn" onClick={function () { setDeletingUser(null) }}>
                                Cancel
                            </button>
                            <button className="admin-modal-delete-btn" onClick={handleConfirmDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default AdminPage