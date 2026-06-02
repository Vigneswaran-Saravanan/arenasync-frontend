import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'
import IconBell from '../icons/IconBell'
import IconHome from '../icons/IconHome'
import IconCalendar from '../icons/IconCalendar'
import IconUser from '../icons/IconUser'
import IconPlus from '../icons/IconPlus'
import IconBuilding from '../icons/IconBuilding'
import IconChevron from '../icons/IconChevron'

function Navbar({ role, setRole }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [showNotif, setShowNotif] = useState(false)
  const [showRoleMenu, setShowRoleMenu] = useState(false)

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

  // Notifications per role
  const notifsByRole = {
    Player: [
      { id: 1, title: 'Join Request Approved', message: "You're confirmed for Sunday Kickabout", time: '2h ago', read: false },
      { id: 2, title: 'Match Tomorrow', message: 'Sunday Kickabout at 10:00 AM', time: '1d ago', read: true },
    ],
    Organizer: [
      { id: 1, title: 'New Join Request', message: 'Ahmed Hassan wants to join your match', time: '1h ago', read: false },
      { id: 2, title: 'New Join Request', message: 'Fatima Malik wants to join your match', time: '2h ago', read: false },
    ],
    'Venue Host': [
      { id: 1, title: 'New Booking', message: 'Carlos booked your venue for Sunday', time: '3h ago', read: false },
    ],
    Admin: [
      { id: 1, title: 'New User Registered', message: 'Ahmed Hassan joined as Player', time: '1h ago', read: false },
    ],
  }

  const notifs = notifsByRole[role] || []
  const unreadCount = notifs.filter(function(n) { return !n.read }).length

  return (
    <>
      <nav className={role === 'Admin' ? 'navbar navbar-admin' : 'navbar'}>
        <div className="navbar-inner">

          {/* Logo — replace SVG with your own logo SVG */}
          <div className="navbar-logo" onClick={function() { navigate('/') }}>
            {/* YOUR LOGO SVG GOES HERE */}
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#16A34A" />
              <circle cx="12" cy="9" r="2.5" fill="white" />
            </svg>
            <span className="navbar-logo-text">
              Arena<span className="navbar-logo-green">Sync</span>
            </span>
          </div>

          {/* Navigation links — change based on role */}
          <div className="navbar-links">

            <button
              className={isActive('/') ? 'nav-link-btn active' : 'nav-link-btn'}
              onClick={function() { navigate('/') }}
            >
              <IconHome size={15} color={isActive('/') ? '#16A34A' : '#6B7280'} />
              Home
            </button>

            {role === 'Player'  && (
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
                className={isActive('/organizer-match/:id') ? 'nav-link-btn active' : 'nav-link-btn'}
                onClick={function() { navigate('/organizer-match/:id') }}
              >
                <IconCalendar size={15} color={isActive('/my-matches') ? '#16A34A' : '#6B7280'} />
                Manage Matches
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
                setShowRoleMenu(false)
              }}
            >
              <IconBell size={21} color={role === 'Admin' ? '#9CA3AF' : '#6B7280'} />
              {unreadCount > 0 && (
                <span className="navbar-badge">{unreadCount}</span>
              )}
            </div>

            {/* Role switcher */}
            <div style={{ position: 'relative' }}>
              <button
                className="role-switcher-btn"
                onClick={function() {
                  setShowRoleMenu(!showRoleMenu)
                  setShowNotif(false)
                }}
              >
                <span className={getRoleBadgeClass(role)}>{role}</span>
                <IconChevron size={13} color="#6B7280" />
              </button>

              {showRoleMenu && (
                <div className="role-dropdown">
                  <div className="role-dropdown-label">Switch Role</div>
                  {['Player', 'Organizer', 'Venue Host', 'Admin'].map(function(r) {
                    return (
                      <button
                        key={r}
                        className={role === r ? 'role-option-btn selected' : 'role-option-btn'}
                        onClick={function() {
                          setRole(r)
                          setShowRoleMenu(false)
                          navigate('/')
                        }}
                      >
                        {role === r ? '✓ ' : ''}{r}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="navbar-avatar">VS</div>

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
              <button className="notif-mark-read">Mark all read</button>
            </div>
            <div className="notif-list">
              {notifs.map(function(n) {
                return (
                  <div key={n.id} className={n.read ? 'notif-item' : 'notif-item unread'}>
                    <p className="notif-item-title">{n.title}</p>
                    <p className="notif-item-message">{n.message}</p>
                    <p className="notif-item-time">{n.time}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Close dropdowns when clicking outside */}
      {(showNotif || showRoleMenu) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 99 }}
          onClick={function() {
            setShowNotif(false)
            setShowRoleMenu(false)
          }}
        />
      )}
    </>
  )
}

export default Navbar