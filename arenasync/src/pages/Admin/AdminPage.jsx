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

    // Matches section state
    const [matches, setMatches] = useState([])
    const [matchesLoaded, setMatchesLoaded] = useState(false)
    const [matchesLoading, setMatchesLoading] = useState(false)
    const [matchSearchTerm, setMatchSearchTerm] = useState('')
    const [matchStatusFilter, setMatchStatusFilter] = useState('All')

    // The match currently open in the Delete confirmation modal (null = closed)
    const [deletingMatch, setDeletingMatch] = useState(null)

    // Get the logged-in admin so we can hide Edit/Delete on their own row
    const storedUser = localStorage.getItem('user')
    const currentAdmin = storedUser ? JSON.parse(storedUser) : null

    // Block anyone who is not an Admin from seeing this page
    useEffect(function () {
        if (role !== 'Admin') {
            navigate('/')
        }
    }, [role, navigate])

    // Load all users 
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

    // Load all matches 
    useEffect(function () {
        async function fetchMatches() {
            try {
                setMatchesLoading(true)
                const token = localStorage.getItem('token')

                const res = await axios.get('http://localhost:5000/api/admin/matches', {
                    headers: { Authorization: 'Bearer ' + token }
                })
                setMatches(res.data)
                setMatchesLoaded(true)

            } catch (err) {
                setActionError('Could not load matches.')
            } finally {
                setMatchesLoading(false)
            }
        }

        if (activeSection === 'matches' && !matchesLoaded) {
            fetchMatches()
        }
    }, [activeSection, matchesLoaded])

    // Apply search and role filter to the users list
    const filteredUsers = users.filter(function (u) {
        const search = searchTerm.toLowerCase()
        const matchesSearch =
            u.name.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search)

        const matchesRole = roleFilter === 'All' || u.role === roleFilter

        return matchesSearch && matchesRole
    })

    // Apply search and status filter to the matches list
    const filteredMatches = matches.filter(function (m) {
        const search = matchSearchTerm.toLowerCase()
        const organizerName = m.organizer ? m.organizer.name.toLowerCase() : ''

        const matchesSearch =
            m.title.toLowerCase().includes(search) ||
            organizerName.includes(search)

        const matchesStatusFilter = matchStatusFilter === 'All' || m.status === matchStatusFilter

        return matchesSearch && matchesStatusFilter
    })

    // Open the Edit modal pre-filled 
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

            setUsers(users.map(function (u) {
                return u._id === editingUser._id ? res.data : u
            }))

            setEditingUser(null)

        } catch (err) {
            setActionError('Could not update user.')
        }
    }

    // Delete the user from the backend and remove them from our list
    async function handleConfirmDeleteUser() {
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

    // Update a match's status the moment the dropdown changes
    async function handleStatusChange(matchId, newStatus) {
        try {
            const token = localStorage.getItem('token')

            await axios.patch(
                'http://localhost:5000/api/admin/matches/' + matchId,
                { status: newStatus },
                { headers: { Authorization: 'Bearer ' + token } }
            )

            setMatches(matches.map(function (m) {
                return m._id === matchId ? { ...m, status: newStatus } : m
            }))

        } catch (err) {
            setActionError('Could not update match status.')
        }
    }

    // Delete the match from the backend and remove it from our list
    async function handleConfirmDeleteMatch() {
        try {
            const token = localStorage.getItem('token')

            await axios.delete(
                'http://localhost:5000/api/admin/matches/' + deletingMatch._id,
                { headers: { Authorization: 'Bearer ' + token } }
            )

            setMatches(matches.filter(function (m) {
                return m._id !== deletingMatch._id
            }))

            setDeletingMatch(null)

        } catch (err) {
            setActionError('Could not delete match.')
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

                    {/* Matches section */}
                    {activeSection === 'matches' && (
                        <>
                            <div className="admin-toolbar">
                                <input
                                    type="text"
                                    className="admin-search-input"
                                    placeholder="Search matches..."
                                    value={matchSearchTerm}
                                    onChange={function (e) { setMatchSearchTerm(e.target.value) }}
                                />
                                <select
                                    className="admin-filter-select"
                                    value={matchStatusFilter}
                                    onChange={function (e) { setMatchStatusFilter(e.target.value) }}
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Upcoming">Upcoming</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            {matchesLoading ? (
                                <p style={{ color: '#6B7280' }}>Loading matches...</p>
                            ) : (
                                <div className="admin-table-wrap">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Organizer</th>
                                                <th>Venue</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredMatches.map(function (m) {
                                                return (
                                                    <tr key={m._id}>
                                                        <td>{m.title}</td>
                                                        <td>{m.organizer ? m.organizer.name : '—'}</td>
                                                        <td>{m.venue}</td>
                                                        <td>{new Date(m.date).toLocaleDateString()}</td>
                                                        <td>
                                                            <select
                                                                className="admin-status-select"
                                                                value={m.status}
                                                                onChange={function (e) { handleStatusChange(m._id, e.target.value) }}
                                                            >
                                                                <option value="Upcoming">Upcoming</option>
                                                                <option value="Ongoing">Ongoing</option>
                                                                <option value="Completed">Completed</option>
                                                                <option value="Cancelled">Cancelled</option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="admin-action-btn admin-action-delete"
                                                                onClick={function () { setDeletingMatch(m) }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
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
                            <button className="admin-modal-delete-btn" onClick={handleConfirmDeleteUser}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Match confirmation modal */}
            {deletingMatch && (
                <div className="admin-modal-overlay" onClick={function () { setDeletingMatch(null) }}>
                    <div className="admin-modal-card" onClick={function (e) { e.stopPropagation() }}>
                        <h3 className="admin-modal-title">Delete "{deletingMatch.title}"?</h3>
                        <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 20 }}>
                            This will permanently remove the match. This cannot be undone.
                        </p>

                        <div className="admin-modal-actions">
                            <button className="admin-modal-cancel-btn" onClick={function () { setDeletingMatch(null) }}>
                                Cancel
                            </button>
                            <button className="admin-modal-delete-btn" onClick={handleConfirmDeleteMatch}>
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