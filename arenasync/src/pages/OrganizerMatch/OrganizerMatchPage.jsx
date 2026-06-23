import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './OrganizerMatchPage.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import IconCalendar from '../../components/icons/IconCalendar'
import IconClock from '../../components/icons/IconClock'
import IconUser from '../../components/icons/IconUser'

function OrganizerMatchPage({ role, setRole }) {

  const { id } = useParams()
  const navigate = useNavigate()

  // Real match data from backend
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Which section tab is active
  const [activeSection, setActiveSection] = useState('requests')

  // Toast message
  const [toast, setToast] = useState(null)

  // Show cancel match modal
  const [showCancelModal, setShowCancelModal] = useState(false)

  // Match cancelled state
  const [matchCancelled, setMatchCancelled] = useState(false)

  // Action loading for accept/decline buttons
  const [actionLoadingId, setActionLoadingId] = useState(null)

  // Mark as completed loading state
  const [completingMatch, setCompletingMatch] = useState(false)

  // Attendance state
  const [attendedIds, setAttendedIds] = useState([])
  const [submittingAttendance, setSubmittingAttendance] = useState(false)
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false)

  // Fetch match from backend when page loads
  useEffect(function () {
    fetchMatch()
  }, [id])

  async function fetchMatch() {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:5000/api/matches/' + id, {
        headers: { Authorization: 'Bearer ' + token }
      })
      setMatch(res.data.match)
    } catch (err) {
      setError('Match not found or you are not authorized to manage it.')
    } finally {
      setLoading(false)
    }
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(function () { setToast(null) }, 3000)
  }

  // Accept a join request — calls backend confirmPlayer API
  async function handleAccept(playerId) {
    setActionLoadingId(playerId)
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        'http://localhost:5000/api/matches/' + id + '/players/' + playerId,
        { action: 'confirmed' },
        { headers: { Authorization: 'Bearer ' + token } }
      )
      showToast('Player has been accepted!')
      await fetchMatch()
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not accept player.')
    } finally {
      setActionLoadingId(null)
    }
  }

  // Decline a join request — calls backend confirmPlayer API
  async function handleDecline(playerId) {
    setActionLoadingId(playerId)
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        'http://localhost:5000/api/matches/' + id + '/players/' + playerId,
        { action: 'declined' },
        { headers: { Authorization: 'Bearer ' + token } }
      )
      showToast('Player has been declined.')
      await fetchMatch()
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not decline player.')
    } finally {
      setActionLoadingId(null)
    }
  }

  // Cancel the match — calls backend deleteMatch API
  async function handleCancelMatch() {
    try {
      const token = localStorage.getItem('token')
      await axios.delete('http://localhost:5000/api/matches/' + id, {
        headers: { Authorization: 'Bearer ' + token }
      })
      setMatchCancelled(true)
      setShowCancelModal(false)
      showToast('Match cancelled. All players have been notified.')
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not cancel match.')
      setShowCancelModal(false)
    }
  }

  // Mark match as Completed
  async function handleMarkCompleted() {
    setCompletingMatch(true)
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        'http://localhost:5000/api/matches/' + id,
        { status: 'Completed' },
        { headers: { Authorization: 'Bearer ' + token } }
      )
      showToast('Match marked as Completed!')
      await fetchMatch()
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not update match status.')
    } finally {
      setCompletingMatch(false)
    }
  }

  // Toggle a player in the attendance list
  function toggleAttendance(playerId) {
    setAttendedIds(function (prev) {
      if (prev.includes(playerId)) {
        return prev.filter(function (id) { return id !== playerId })
      }
      return [...prev, playerId]
    })
  }

  // Submit attendance to backend
  async function handleSubmitAttendance() {
    setSubmittingAttendance(true)
    try {
      const token = localStorage.getItem('token')
      await axios.patch(
        'http://localhost:5000/api/matches/' + id + '/attendance',
        { attendedPlayerIds: attendedIds },
        { headers: { Authorization: 'Bearer ' + token } }
      )
      showToast('Attendance saved! Player profiles have been updated.')
      setAttendanceSubmitted(true)
      await fetchMatch()
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not save attendance.')
    } finally {
      setSubmittingAttendance(false)
    }
  }

  function getSkillClass(level) {
    if (level === 'Beginner') return 'skill-badge skill-beginner'
    if (level === 'Intermediate') return 'skill-badge skill-intermediate'
    return 'skill-badge skill-advanced'
  }

  function getInitials(name) {
    if (!name) return '?'
    return name.split(' ').map(function (n) { return n[0] }).join('').toUpperCase().slice(0, 2)
  }

  // Loading state
  if (loading) {
    return (
      <div className="organizer-match-page">
        <Navbar role={role} setRole={setRole} />
        <div style={{ padding: 60, textAlign: 'center', color: '#6B7280' }}>Loading match...</div>
      </div>
    )
  }

  // Error state
  if (error || !match) {
    return (
      <div className="organizer-match-page">
        <Navbar role={role} setRole={setRole} />
        <div style={{ padding: 60, textAlign: 'center' }}>
          <h2>{error || 'Match not found'}</h2>
          <button
            onClick={function () { navigate('/') }}
            style={{ marginTop: 16, padding: '10px 24px', background: '#16A34A', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // Split players into pending, confirmed, and processed (declined)
  const pendingRequests = match.players?.filter(function (p) { return p.status === 'pending' }) || []
  const confirmedPlayers = match.players?.filter(function (p) { return p.status === 'confirmed' }) || []
  const declinedRequests = match.players?.filter(function (p) { return p.status === 'declined' }) || []

  const emptySlots = match.maxPlayers - confirmedPlayers.length

  // Format date
  const formattedDate = match.date
    ? new Date(match.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
      })
    : 'TBD'

  return (
    <div className="organizer-match-page">

      <Navbar role={role} setRole={setRole} />

      <div className="organizer-match-content">

        {/* Back button */}
        <button className="back-btn" onClick={function () { navigate('/') }}>
          Back to Matches
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
                  {formattedDate}
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
                  {emptySlots} spots left
                </div>
              </div>
            </div>

            {!matchCancelled && (
              <div className="org-header-actions">
                {match.status !== 'Completed' && (
                  <button
                    className="btn-edit-match"
                    onClick={function () { navigate('/edit-match/' + id) }}
                  >
                    Edit Match
                  </button>
                )}
                {match.status !== 'Completed' && (
                  <button
                    className="btn-complete-match"
                    onClick={handleMarkCompleted}
                    disabled={completingMatch}
                  >
                    {completingMatch ? 'Updating...' : 'Mark as Completed'}
                  </button>
                )}
                {match.status !== 'Completed' && (
                  <button
                    className="btn-cancel-match"
                    onClick={function () { setShowCancelModal(true) }}
                  >
                    Cancel Match
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section Tabs */}
        <div className="section-tabs">
          <button
            className={activeSection === 'requests' ? 'section-tab-btn active' : 'section-tab-btn'}
            onClick={function () { setActiveSection('requests') }}
          >
            Join Requests ({pendingRequests.length})
          </button>
          <button
            className={activeSection === 'players' ? 'section-tab-btn active' : 'section-tab-btn'}
            onClick={function () { setActiveSection('players') }}
          >
            Player Grid
          </button>
          {match.status === 'Completed' && (
            <button
              className={activeSection === 'attendance' ? 'section-tab-btn active' : 'section-tab-btn'}
              onClick={function () { setActiveSection('attendance') }}
            >
              Mark Attendance
            </button>
          )}
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

            {pendingRequests.length === 0 && declinedRequests.length === 0 && (
              <div className="no-requests">No join requests yet</div>
            )}

            {pendingRequests.map(function (req) {
              const playerId = req.user?._id || req.user
              const name = req.user?.name || 'Player'
              const skillLevel = req.user?.skillLevel || 'Beginner'

              return (
                <div key={playerId} className="request-row">

                  <div className="request-avatar">{getInitials(name)}</div>

                  <div className="request-info">
                    <div className="request-name">
                      {name}
                      <span className={getSkillClass(skillLevel)}>
                        {skillLevel}
                      </span>
                    </div>
                    <div className="request-meta">
                      <span>{req.user?.email || ''}</span>
                    </div>
                  </div>

                  <div className="request-actions">
                    <button
                      className="btn-accept"
                      onClick={function () { handleAccept(playerId) }}
                      disabled={actionLoadingId === playerId}
                    >
                      {actionLoadingId === playerId ? '...' : 'Accept'}
                    </button>
                    <button
                      className="btn-decline"
                      onClick={function () { handleDecline(playerId) }}
                      disabled={actionLoadingId === playerId}
                    >
                      {actionLoadingId === playerId ? '...' : 'Decline'}
                    </button>
                  </div>

                </div>
              )
            })}

            {/* Declined requests */}
            {declinedRequests.length > 0 && (
              <div>
                <p className="processed-label">Processed</p>
                {declinedRequests.map(function (req) {
                  const playerId = req.user?._id || req.user
                  const name = req.user?.name || 'Player'
                  return (
                    <div key={playerId} className="processed-row">
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F3F4F6', color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                        {getInitials(name)}
                      </div>
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#374151' }}>
                        {name}
                      </span>
                      <span style={{
                        fontSize: 12,
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: 12,
                        background: '#FEE2E2',
                        color: '#DC2626',
                      }}>
                        Declined
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

              {confirmedPlayers.map(function (player) {
                const name = player.user?.name || 'Player'
                const playerId = player.user?._id || player.user
                const isOrganizer = playerId === (match.organizer?._id?.toString() || match.organizer?.toString())

                return (
                  <div key={playerId} className="player-slot">
                    <div className={isOrganizer ? 'player-avatar organizer' : 'player-avatar'}>
                      {getInitials(name)}
                    </div>
                    <p>{name.split(' ')[0]}</p>
                    {isOrganizer && <small>Organizer</small>}
                  </div>
                )
              })}

              {Array.from({ length: emptySlots }).map(function (_, i) {
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

        {/* Attendance Section — only shown when match is Completed */}
        {activeSection === 'attendance' && match.status === 'Completed' && (
          <div className="section-card">
            <div className="section-card-header">
              <h3>Mark Attendance</h3>
              <span style={{ fontSize: 13, color: '#6B7280' }}>
                Tick the players who showed up
              </span>
            </div>

            {confirmedPlayers.length === 0 ? (
              <div className="no-requests">No confirmed players to mark attendance for</div>
            ) : (
              <>
                {confirmedPlayers.map(function (player) {
                  const playerId = player.user?._id || player.user
                  const name = player.user?.name || 'Player'
                  const isChecked = attendedIds.includes(playerId?.toString())

                  return (
                    <div key={playerId} className="attendance-row">
                      <input
                        type="checkbox"
                        className="attendance-checkbox"
                        checked={isChecked}
                        onChange={function () { toggleAttendance(playerId?.toString()) }}
                      />
                      <div className="request-avatar">{getInitials(name)}</div>
                      <span className="attendance-name">{name}</span>
                    </div>
                  )
                })}

                <div style={{ marginTop: 20 }}>
                  <button
                    className="btn-submit-attendance"
                    onClick={handleSubmitAttendance}
                    disabled={submittingAttendance}
                  >
                    {submittingAttendance ? 'Saving...' : 'Save Attendance'}
                  </button>
                  {attendanceSubmitted && (
                    <p style={{ fontSize: 13, color: '#16A34A', marginTop: 8, fontWeight: 600 }}>
                      Attendance saved — player profiles updated.
                    </p>
                  )}
                </div>
              </>
            )}
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
                onClick={function () { setShowCancelModal(false) }}
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