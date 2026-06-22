import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import './Navbar.css'
import IconBell from '../icons/IconBell'
import IconHome from '../icons/IconHome'
import IconCalendar from '../icons/IconCalendar'
import IconUser from '../icons/IconUser'
import IconPlus from '../icons/IconPlus'
import IconBuilding from '../icons/IconBuilding'

function Navbar({ role, setRole }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [showNotif, setShowNotif] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const [notifs, setNotifs] = useState([])

  // Get logged in user from localStorage
  const storedUser = localStorage.getItem('user')
  const currentUser = storedUser ? JSON.parse(storedUser) : null

  // Get first letter of name for avatar
  const avatarLetter = currentUser ? currentUser.name.charAt(0).toUpperCase() : 'U'

  // Get first name only for display
  const firstName = currentUser ? currentUser.name.split(' ')[0] : 'User'


  function isActive(path) {
    return location.pathname === path
  }

  // Get role badge CSS class
  function getRoleBadgeClass(r) {
    if (r === 'Organizer') return 'role-badge role-badge-organizer'
    if (r === 'Venue Host') return 'role-badge role-badge-venuehost'
    if (r === 'Admin') return 'role-badge role-badge-admin'
    return 'role-badge role-badge-player'
  }

  // Logout function
  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setRole('Player')
    navigate('/login')
  }

  // Fetch real notifications 
  useEffect(function () {
    async function fetchNotifications() {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const res = await axios.get('http://localhost:5000/api/notifications', {
          headers: { Authorization: 'Bearer ' + token }
        })
        setNotifs(res.data)

      } catch (err) {

        console.log('Could not load notifications')
      }
    }
    fetchNotifications()
  }, [])

  // Count unread notifications from real data
  const unreadCount = notifs.filter(function (n) { return !n.read }).length

  // When the bell is opened, mark all as read on the backend
  async function handleOpenBell() {
    setShowNotif(!showNotif)
    setShowUserMenu(false)

    if (!showNotif && unreadCount > 0) {
      try {
        const token = localStorage.getItem('token')

        await axios.patch('http://localhost:5000/api/notifications/mark-all-read', {}, {
          headers: { Authorization: 'Bearer ' + token }
        })

        // Update local state 
        setNotifs(notifs.map(function (n) {
          return { ...n, read: true }
        }))

      } catch (err) {
        console.log('Could not mark notifications as read')
      }
    }
  }

  // Organizer accepts a join request directly from the notification panel
  async function handleAccept(notif) {
    try {
      const token = localStorage.getItem('token')

      await axios.put(
        'http://localhost:5000/api/matches/' + notif.matchId + '/players/' + notif.senderId,
        { action: 'confirmed' },
        { headers: { Authorization: 'Bearer ' + token } }
      )

    } catch (err) {
      console.log('Could not accept request')
    } finally {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(
          'http://localhost:5000/api/notifications/' + notif._id,
          { headers: { Authorization: 'Bearer ' + token } }
        )
      } catch (err) {
        console.log('Could not delete notification')
      }
      setNotifs(notifs.filter(function (n) { return n._id !== notif._id }))
    }
  }

  // Organizer declines a join request directly from the notification panel
  async function handleDecline(notif) {
    try {
      const token = localStorage.getItem('token')

      await axios.put(
        'http://localhost:5000/api/matches/' + notif.matchId + '/players/' + notif.senderId,
        { action: 'declined' },
        { headers: { Authorization: 'Bearer ' + token } }
      )

    } catch (err) {
      console.log('Could not decline request')
    } finally {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(
          'http://localhost:5000/api/notifications/' + notif._id,
          { headers: { Authorization: 'Bearer ' + token } }
        )
      } catch (err) {
        console.log('Could not delete notification')
      }
      setNotifs(notifs.filter(function (n) { return n._id !== notif._id }))
    }
  }

  // Convert a notification type to a readable title
  function getNotifTitle(type) {
    if (type === 'join_request') return 'New Join Request'
    if (type === 'request_accepted') return 'Join Request Approved'
    if (type === 'request_declined') return 'Join Request Declined'
    if (type === 'match_cancelled') return 'Match Cancelled'
    return 'Notification'
  }

  // Format the createdAt timestamp to a relative time string
  function formatTime(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (minutes < 60) return minutes + 'm ago'
    if (hours < 24) return hours + 'h ago'
    return days + 'd ago'
  }

  return (
    <>
      <nav className={role === 'Admin' ? 'navbar navbar-admin' : 'navbar'}>
        <div className="navbar-inner">

          {/* Logo */}
          <div className="navbar-logo" onClick={function () {
            navigate(role === 'Organizer' ? '/my-matches' : role === 'Venue Host' ? '/my-venues' : '/')
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="50" viewBox="0 0 64 73">
              <defs>
                <clipPath id="field">
                  <circle cx="32" cy="29" r="19" />
                </clipPath>
              </defs>
              <path d="M32 3C17 3 5 15 5 30C5 42 12.5 52 22 60L32 73L42 60C51.5 52 59 42 59 30C59 15 47 3 32 3Z" fill="#16A34A" />
              <circle cx="32" cy="29" r="20.5" fill="none" stroke="white" strokeWidth="1.7" />
              <circle cx="32" cy="29" r="19" fill="#16A34A" />
              <g clipPath="url(#field)" fill="none" stroke="white" strokeWidth="0.9"
                strokeLinecap="round" strokeLinejoin="round">
                <rect x="14" y="9" width="36" height="40" />
                <line x1="14" y1="29" x2="50" y2="29" />
                <circle cx="32" cy="29" r="7" />
                <circle cx="32" cy="29" r="0.8" fill="white" stroke="none" />
                <rect x="19" y="9" width="26" height="9" />
                <rect x="23" y="9" width="18" height="4" />
                <rect x="19" y="40" width="26" height="9" />
                <rect x="23" y="45" width="18" height="4" />
              </g>
            </svg>
            <span className="navbar-logo-text">
              Arena<span className="navbar-logo-green">Sync</span>
            </span>
          </div>

          {/* Navigation links */}
          <div className="navbar-links">

            {role !== 'Organizer' && role !== 'Venue Host' && (
              <button
                className={isActive('/') ? 'nav-link-btn active' : 'nav-link-btn'}
                onClick={function () { navigate('/') }}
              >
                <IconHome size={15} color={isActive('/') ? '#16A34A' : '#6B7280'} />
                Home
              </button>
            )}

            {(role === 'Player' || role === 'Organizer') && (
              <button
                className={isActive('/my-matches') ? 'nav-link-btn active' : 'nav-link-btn'}
                onClick={function () { navigate('/my-matches') }}
              >
                <IconCalendar size={15} color={isActive('/my-matches') ? '#16A34A' : '#6B7280'} />
                My Matches
              </button>
            )}

            {role === 'Organizer' && (
              <button
                className={isActive('/create-match') ? 'nav-link-btn active' : 'nav-link-btn'}
                onClick={function () { navigate('/create-match') }}
              >
                <IconPlus size={15} color={isActive('/create-match') ? '#16A34A' : '#6B7280'} />
                Create Match
              </button>
            )}

            {role === 'Venue Host' && (
              <button
                className={isActive('/my-venues') ? 'nav-link-btn active' : 'nav-link-btn'}
                onClick={function () { navigate('/my-venues') }}
              >
                <IconBuilding size={15} color={isActive('/my-venues') ? '#16A34A' : '#6B7280'} />
                My Venues
              </button>
            )}

            {role === 'Venue Host' && (
              <button
                className={isActive('/create-venue') ? 'nav-link-btn active' : 'nav-link-btn'}
                onClick={function () { navigate('/create-venue') }}
              >
                <IconPlus size={15} color={isActive('/create-venue') ? '#16A34A' : '#6B7280'} />
                Create Venue
              </button>
            )}

            {role === 'Admin' && (
              <button
                className={isActive('/admin') ? 'nav-link-btn active' : 'nav-link-btn'}
                onClick={function () { navigate('/admin') }}
              >
                Admin Panel
              </button>
            )}

            <button className="nav-link-btn">
              <IconUser size={15} color="#6B7280" />
              Profile
            </button>

          </div>

          {/* Right side */}
          <div className="navbar-right">

            {/* Bell */}
            <div className="navbar-bell" onClick={handleOpenBell}>
              <IconBell size={21} color={role === 'Admin' ? '#9CA3AF' : '#6B7280'} />
              {unreadCount > 0 && (
                <span className="navbar-badge">{unreadCount}</span>
              )}
            </div>

            {/* Role badge */}
            <span className={getRoleBadgeClass(role)}>{role}</span>

            {/* User avatar + dropdown */}
            <div style={{ position: 'relative' }}>
              <div
                className="navbar-avatar"
                onClick={function () {
                  setShowUserMenu(!showUserMenu)
                  setShowNotif(false)
                }}
              >
                {avatarLetter}
              </div>

              {showUserMenu && (
                <div className="role-dropdown">
                  <div className="role-dropdown-label">{firstName}</div>
                  <div style={{
                    padding: '8px 14px',
                    fontSize: 12,
                    color: '#6B7280',
                    borderBottom: '1px solid #F3F4F6'
                  }}>
                    {currentUser ? currentUser.email : ''}
                  </div>
                  <button
                    className="role-option-btn"
                    onClick={handleLogout}
                    style={{ color: '#DC2626', fontWeight: 600 }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Notification panel */}
      {showNotif && (
        <>
          <div className="notif-overlay" onClick={function () { setShowNotif(false) }} />
          <div className="notif-panel">
            <div className="notif-header">
              <span>Notifications</span>
              <button className="notif-mark-read" onClick={function () { setShowNotif(false) }}>
                Close
              </button>
            </div>
            <div className="notif-list">
              {notifs.length === 0 && (
                <div style={{ padding: '20px 16px', color: '#6B7280', fontSize: 13 }}>
                  No notifications yet
                </div>
              )}
              {notifs.map(function (n) {
                return (
                  <div key={n._id} className={n.read ? 'notif-item' : 'notif-item unread'}>
                    <p className="notif-item-title">{getNotifTitle(n.type)}</p>
                    <p className="notif-item-message">{n.message}</p>
                    <p className="notif-item-time">{formatTime(n.createdAt)}</p>

                    {n.type === 'join_request' && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button
                          onClick={function () { handleAccept(n) }}
                          style={{ background: '#16A34A', color: 'white', border: 'none', borderRadius: 6, padding: '5px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={function () { handleDecline(n) }}
                          style={{ background: 'white', color: '#DC2626', border: '1px solid #FCA5A5', borderRadius: 6, padding: '5px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Close dropdowns when clicking outside */}
      {(showNotif || showUserMenu) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 99 }}
          onClick={function () {
            setShowNotif(false)
            setShowUserMenu(false)
          }}
        />
      )}
    </>
  )
}

export default Navbar