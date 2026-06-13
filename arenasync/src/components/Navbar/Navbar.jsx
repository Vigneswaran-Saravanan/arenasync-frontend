import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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

  // Get logged in user from localStorage
  const storedUser = localStorage.getItem('user')
  const currentUser = storedUser ? JSON.parse(storedUser) : null

  // Get first letter of name for avatar
  const avatarLetter = currentUser ? currentUser.name.charAt(0).toUpperCase() : 'U'

  // Get first name only for display
  const firstName = currentUser ? currentUser.name.split(' ')[0] : 'User'

  // Check if a path is the current page
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

  // Notifications per role
  const notifsByRole = {
    Player: [
      {
        id: 1,
        title: 'Join Request Approved',
        message: "You're confirmed for Sunday Morning Kickabout",
        time: '2h ago',
        read: false,
      },
      {
        id: 2,
        title: 'Match Reminder',
        message: 'Sunday Morning Kickabout tomorrow at 10:00 AM',
        time: '1d ago',
        read: true,
      },
      {
        id: 3,
        title: 'Match Cancelled',
        message: 'Friday Futsal has been cancelled by organizer',
        time: '2d ago',
        read: true,
      },
    ],
    Organizer: [
      {
        id: 1,
        title: 'New Join Request',
        message: 'Ahmed Hassan (88% attendance) wants to join',
        time: '1h ago',
        read: false,
        isRequest: true,
        playerId: 101,
      },
      {
        id: 2,
        title: 'New Join Request',
        message: 'Fatima Malik (95% attendance) wants to join',
        time: '2h ago',
        read: false,
        isRequest: true,
        playerId: 102,
      },
      {
        id: 3,
        title: 'New Join Request',
        message: 'Jordan Lee (72% attendance) wants to join',
        time: '3h ago',
        read: false,
        isRequest: true,
        playerId: 103,
      },
    ],
    'Venue Host': [
      {
        id: 1,
        title: 'New Booking',
        message: 'Carlos Mendez booked your venue for Sunday Jun 7',
        time: '3h ago',
        read: false,
      },
      {
        id: 2,
        title: 'New Booking',
        message: 'Sara Ivanova booked your venue for Wed Jun 4',
        time: '1d ago',
        read: true,
      },
    ],
    Admin: [
      {
        id: 1,
        title: 'New User Registered',
        message: 'Ahmed Hassan joined as Player',
        time: '1h ago',
        read: false,
      },
    ],
  }

  const notifs = notifsByRole[role] || []
  const unreadCount = notifs.filter(function(n) { return !n.read }).length

  return (
    <>
      <nav className={role === 'Admin' ? 'navbar navbar-admin' : 'navbar'}>
        <div className="navbar-inner">

          {/* Logo */}
          <div className="navbar-logo" onClick={function() { navigate('/') }}>
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

            <button
              className={isActive('/') ? 'nav-link-btn active' : 'nav-link-btn'}
              onClick={function() { navigate('/') }}
            >
              <IconHome size={15} color={isActive('/') ? '#16A34A' : '#6B7280'} />
              Home
            </button>

            {role === 'Player' && (
              <button
                className={isActive('/my-matches') ? 'nav-link-btn active' : 'nav-link-btn'}
                onClick={function() { navigate('/my-matches') }}
              >
                <IconCalendar size={15} color={isActive('/my-matches') ? '#16A34A' : '#6B7280'} />
                My Matches
              </button>
            )}

            {role === 'Organizer' && (
              <button
                className={isActive('/organizer-match/1') ? 'nav-link-btn active' : 'nav-link-btn'}
                onClick={function() { navigate('/organizer-match/1') }}
              >
                <IconCalendar size={15} color={isActive('/organizer-match/1') ? '#16A34A' : '#6B7280'} />
                Manage Match
              </button>
            )}

            {role === 'Organizer' && (
              <button
                className={isActive('/create-match') ? 'nav-link-btn active' : 'nav-link-btn'}
                onClick={function() { navigate('/create-match') }}
              >
                <IconPlus size={15} color={isActive('/create-match') ? '#16A34A' : '#6B7280'} />
                Create Match
              </button>
            )}

            {role === 'Venue Host' && (
              <button
                className={isActive('/venue-dashboard') ? 'nav-link-btn active' : 'nav-link-btn'}
                onClick={function() { navigate('/venue-dashboard') }}
              >
                <IconBuilding size={15} color={isActive('/venue-dashboard') ? '#16A34A' : '#6B7280'} />
                My Venue
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
            <div
              className="navbar-bell"
              onClick={function() {
                setShowNotif(!showNotif)
                setShowUserMenu(false)
              }}
            >
              <IconBell size={21} color={role === 'Admin' ? '#9CA3AF' : '#6B7280'} />
              {unreadCount > 0 && (
                <span className="navbar-badge">{unreadCount}</span>
              )}
            </div>

            {/* Role badge — shows current role, not clickable */}
            <span className={getRoleBadgeClass(role)}>{role}</span>

            {/* User avatar + dropdown */}
            <div style={{ position: 'relative' }}>
              <div
                className="navbar-avatar"
                onClick={function() {
                  setShowUserMenu(!showUserMenu)
                  setShowNotif(false)
                }}
              >
                {avatarLetter}
              </div>

              {/* User dropdown menu */}
              {showUserMenu && (
                <div className="role-dropdown">
                  <div className="role-dropdown-label">
                    {firstName}
                  </div>
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
          <div className="notif-overlay" onClick={function() { setShowNotif(false) }} />
          <div className="notif-panel">
            <div className="notif-header">
              <span>Notifications</span>
              <button className="notif-mark-read" onClick={function() { setShowNotif(false) }}>
                Mark all read
              </button>
            </div>
            <div className="notif-list">
              {notifs.map(function(n) {
                return (
                  <div key={n.id} className={n.read ? 'notif-item' : 'notif-item unread'}>
                    <p className="notif-item-title">{n.title}</p>
                    <p className="notif-item-message">{n.message}</p>
                    <p className="notif-item-time">{n.time}</p>

                    {n.isRequest && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button
                          onClick={function() {
                            alert('Request accepted! Player has been notified.')
                            setShowNotif(false)
                          }}
                          style={{ background: '#16A34A', color: 'white', border: 'none', borderRadius: 6, padding: '5px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={function() {
                            alert('Request declined. Player has been notified.')
                            setShowNotif(false)
                          }}
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
          onClick={function() {
            setShowNotif(false)
            setShowUserMenu(false)
          }}
        />
      )}
    </>
  )
}

export default Navbar