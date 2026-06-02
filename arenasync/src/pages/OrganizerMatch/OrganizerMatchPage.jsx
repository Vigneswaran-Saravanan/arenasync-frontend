import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './OrganizerMatchPage.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import IconCalendar from '../../components/icons/IconCalendar'
import IconClock from '../../components/icons/IconClock'
import IconUser from '../../components/icons/IconUser'
import players from '../../data/players'

function OrganizerMatchPage({ role, setRole }) {

  const navigate = useNavigate()

  // The match this organizer is managing
  const match = {
    id: 1,
    title: 'Sunday Morning Kickabout',
    venue: 'Christie Pits Park',
    address: '750 Bloor St W, Toronto',
    dateLabel: 'Sun, Jun 7',
    time: '10:00 AM',
    skillLevel: 'Beginner',
    maxPlayers: 10,
  }

  // Which section tab is active
  const [activeSection, setActiveSection] = useState('requests')

  // Join requests — starts as pending players
  const [requests, setRequests] = useState(players)

  // Confirmed players in the slot grid
  const [confirmedPlayers, setConfirmedPlayers] = useState([
    { id: 1, name: 'Carlos Mendez', initials: 'CM', isOrganizer: true },
    { id: 2, name: 'Aiden Park', initials: 'AP' },
    { id: 3, name: 'Marcus Cole', initials: 'MC' },
  ])

  // Toast message
  const [toast, setToast] = useState(null)

  // Show cancel match modal
  const [showCancelModal, setShowCancelModal] = useState(false)

  // Match cancelled state
  const [matchCancelled, setMatchCancelled] = useState(false)

  function showToast(msg) {
    setToast(msg)
    setTimeout(function() { setToast(null) }, 3000)
  }

  // Accept a join request
  function handleAccept(playerId) {
    const player = requests.find(function(r) { return r.id === playerId })
    if (!player) return

    // Move to confirmed list
    setConfirmedPlayers([...confirmedPlayers, {
      id: player.id,
      name: player.name,
      initials: player.initials,
    }])

    // Mark as accepted in requests
    setRequests(requests.map(function(r) {
      if (r.id === playerId) return { ...r, status: 'accepted' }
      return r
    }))

    showToast(player.name + ' has been accepted!')
  }

  // Decline a join request
  function handleDecline(playerId) {
    const player = requests.find(function(r) { return r.id === playerId })
    if (!player) return

    setRequests(requests.map(function(r) {
      if (r.id === playerId) return { ...r, status: 'declined' }
      return r
    }))

    showToast(player.name + ' has been declined.')
  }

  // Cancel the match
  function handleCancelMatch() {
    setMatchCancelled(true)
    setShowCancelModal(false)
    showToast('Match cancelled. All players have been notified.')
  }

  // Split requests into pending and processed
  const pendingRequests = requests.filter(function(r) { return r.status === 'pending' })
  const processedRequests = requests.filter(function(r) { return r.status !== 'pending' })

  const emptySlots = match.maxPlayers - confirmedPlayers.length

  function getSkillClass(level) {
    if (level === 'Beginner') return 'skill-badge skill-beginner'
    if (level === 'Intermediate') return 'skill-badge skill-intermediate'
    return 'skill-badge skill-advanced'
  }

  return (
    <div className="organizer-match-page">

      <Navbar role={role} setRole={setRole} />

      <div className="organizer-match-content">

        {/* Back button */}
        <button className="back-btn" onClick={function() { navigate('/') }}>
          ← Back to Matches
        </button>

        {/* Cancelled banner */}
        {matchCancelled && (
          <div className="cancelled-banner">
            This match has been cancelled. All confirmed players have been notified.
          </div>
        )}

        {/* Match Header Card */}
        <div className="org-header-card">
          <div className="org-header-top">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <h1 className="org-match-title">{match.title}</h1>
                <span className="org-badge">Organizer</span>
              </div>
              <div className="org-meta-row">
                <div className="org-chip">
                  <IconCalendar size={12} color="#6B7280" />
                  {match.dateLabel}
                </div>
                <div className="org-chip">
                  <IconClock size={12} color="#6B7280" />
                  {match.time}
                </div>
                <span className={getSkillClass(match.skillLevel)}>
                  {match.skillLevel}
                </span>
                <div className="org-chip">
                  <IconUser size={12} color="#6B7280" />
                  {match.maxPlayers - confirmedPlayers.length} spots left
                </div>
              </div>
            </div>

            {!matchCancelled && (
              <div className="org-header-actions">
                <button className="btn-edit-match">Edit Match</button>
                <button
                  className="btn-cancel-match"
                  onClick={function() { setShowCancelModal(true) }}
                >
                  Cancel Match
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section Tabs */}
        <div className="section-tabs">
          <button
            className={activeSection === 'requests' ? 'section-tab-btn active' : 'section-tab-btn'}
            onClick={function() { setActiveSection('requests') }}
          >
            Join Requests ({pendingRequests.length})
          </button>
          <button
            className={activeSection === 'players' ? 'section-tab-btn active' : 'section-tab-btn'}
            onClick={function() { setActiveSection('players') }}
          >
            Player Grid
          </button>
        </div>

        {/* Join Requests Section */}
        {activeSection === 'requests' && (
          <div className="section-card">

            <div className="section-card-header">
              <h3>Join Requests</h3>
              {pendingRequests.length > 0 && (
                <span className="pending-badge">{pendingRequests.length} pending</span>
              )}
            </div>

            {/* Pending requests */}
            {pendingRequests.length === 0 && processedRequests.length === 0 && (
              <div className="no-requests">No join requests yet</div>
            )}

            {pendingRequests.map(function(req) {
              return (
                <div key={req.id} className="request-row">

                  <div className="request-avatar">{req.initials}</div>

                  <div className="request-info">
                    <div className="request-name">
                      {req.name}
                      <span className={getSkillClass(req.skillLevel)}>
                        {req.skillLevel}
                      </span>
                    </div>
                    <div className="request-meta">
                      <span>Attendance: {req.attendanceRate}%</span>
                      <span>{req.matchesPlayed} matches played</span>
                      <span>{req.city}</span>
                    </div>
                  </div>

                  <div className="request-actions">
                    <button
                      className="btn-accept"
                      onClick={function() { handleAccept(req.id) }}
                    >
                      Accept
                    </button>
                    <button
                      className="btn-decline"
                      onClick={function() { handleDecline(req.id) }}
                    >
                      Decline
                    </button>
                  </div>

                </div>
              )
            })}

            {/* Processed requests */}
            {processedRequests.length > 0 && (
              <div>
                <p className="processed-label">Processed</p>
                {processedRequests.map(function(req) {
                  return (
                    <div key={req.id} className="processed-row">
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F3F4F6', color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                        {req.initials}
                      </div>
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#374151' }}>
                        {req.name}
                      </span>
                      <span style={{
                        fontSize: 12,
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: 12,
                        background: req.status === 'accepted' ? '#F0FDF4' : '#FEE2E2',
                        color: req.status === 'accepted' ? '#16A34A' : '#DC2626',
                      }}>
                        {req.status === 'accepted' ? '✓ Accepted' : '✕ Declined'}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

          </div>
        )}

        {/* Player Grid Section */}
        {activeSection === 'players' && (
          <div className="section-card">
            <div className="section-card-header">
              <h3>Confirmed Players ({confirmedPlayers.length}/{match.maxPlayers})</h3>
            </div>

            <div className="player-grid">

              {confirmedPlayers.map(function(player) {
                return (
                  <div key={player.id} className="player-slot">
                    <div className={player.isOrganizer ? 'player-avatar organizer' : 'player-avatar'}>
                      {player.initials}
                    </div>
                    <p>{player.name.split(' ')[0]}</p>
                    {player.isOrganizer && <small>Organizer</small>}
                  </div>
                )
              })}

              {Array.from({ length: emptySlots }).map(function(_, i) {
                return (
                  <div key={'empty-' + i} className="empty-slot">
                    <div className="empty-slot-circle">+</div>
                    <p>Open</p>
                  </div>
                )
              })}

            </div>
          </div>
        )}

      </div>

      <Footer />

      {/* Cancel Match Modal */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Cancel this match?</h3>
            <p>
              All {confirmedPlayers.length} confirmed players will receive a cancellation notification.
            </p>
            <div className="modal-buttons">
              <button
                className="btn-modal-keep"
                onClick={function() { setShowCancelModal(false) }}
              >
                Keep Match
              </button>
              <button
                className="btn-modal-cancel"
                onClick={handleCancelMatch}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#111827',
          color: 'white',
          padding: '12px 24px',
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 600,
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          zIndex: 999,
        }}>
          {toast}
        </div>
      )}

    </div>
  )
}

export default OrganizerMatchPage