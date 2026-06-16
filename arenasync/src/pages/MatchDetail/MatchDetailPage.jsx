import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './MatchDetailPage.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import IconLocation from '../../components/icons/IconLocation'
import IconCalendar from '../../components/icons/IconCalendar'
import IconClock from '../../components/icons/IconClock'
import IconUser from '../../components/icons/IconUser'
import IconCheck from '../../components/icons/IconCheck'


function MatchDetailPage({ role, setRole }) {

  const { id } = useParams()
  const navigate = useNavigate()

  // Real match data from backend
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Join status: 'none', 'pending', 'confirmed'
  const [joinStatus, setJoinStatus] = useState('none')

  // Action loading and message for join/leave feedback
  const [actionLoading, setActionLoading] = useState(false)
  const [actionMsg, setActionMsg] = useState('')

  // Chat messages
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Carlos Mendez', text: 'Hey everyone, see you Sunday! Bring water.', time: '9:00 AM', own: false },
    { id: 2, sender: 'Aiden Park', text: 'Will do! Which entrance?', time: '9:15 AM', own: false },
  ])

  // Show leave confirmation dialog
  const [showLeaveModal, setShowLeaveModal] = useState(false)

  // Get logged in user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const currentUserId = currentUser.id || currentUser._id

  // Fetch match from backend when page loads
  useEffect(function () {
    async function fetchMatch() {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get('http://localhost:5000/api/matches/' + id, {
          headers: { Authorization: 'Bearer ' + token }
        })
        setMatch(res.data.match)

        // Check if current user already joined this match
        const myEntry = res.data.match.players?.find(function (p) {
          return (p.user?._id?.toString() || p.user?.toString()) === currentUserId?.toString()
        })

        if (myEntry?.status === 'confirmed') setJoinStatus('confirmed')
        else if (myEntry?.status === 'pending') setJoinStatus('pending')
        else setJoinStatus('none')

      } catch (err) {
        setError('Match not found or you are not authorized.')
      } finally {
        setLoading(false)
      }
    }
    fetchMatch()
  }, [id])

  // Re-fetch match after join or leave so slot grid updates
  async function refetchMatch() {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:5000/api/matches/' + id, {
      headers: { Authorization: 'Bearer ' + token }
    })
    setMatch(res.data.match)

    // Re-check join status after refetch
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const myEntry = res.data.match.players?.find(function (p) {
      return (p.user?._id?.toString() || p.user?.toString()) === (user.id || user._id)?.toString()
    })
    if (myEntry?.status === 'confirmed') setJoinStatus('confirmed')
    else if (myEntry?.status === 'pending') setJoinStatus('pending')
    else setJoinStatus('none')

  }

  // Loading state
  if (loading) {
    return (
      <div className="match-detail-page">
        <Navbar role={role} setRole={setRole} />
        <div style={{ padding: 60, textAlign: 'center', color: '#6B7280', fontSize: 15 }}>
          Loading match...
        </div>
      </div>
    )
  }

  // If match not found or error
  if (error || !match) {
    return (
      <div className="match-detail-page">
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

  // Real confirmed players from backend
  const confirmedPlayers = match.players?.filter(function (p) {
    return p.status === 'confirmed'
  }) || []

  const emptySlots = match.maxPlayers - confirmedPlayers.length
  const isFull = emptySlots <= 0

  // Format date from MongoDB
  const formattedDate = match.date
    ? new Date(match.date).toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' })
    : 'TBD'

  // Send chat message
  function handleSend() {
    if (chatInput.trim() === '') return
    setMessages([...messages, {
      id: messages.length + 1,
      sender: 'You',
      text: chatInput,
      time: 'Just now',
      own: true,
    }])
    setChatInput('')
  }

  // Skill badge class
  function getSkillClass(level) {
    if (level === 'Beginner') return 'skill-badge skill-beginner'
    if (level === 'Intermediate') return 'skill-badge skill-intermediate'
    return 'skill-badge skill-advanced'
  }

  // Request to join — calls backend API
  async function handleJoinRequest() {
    setActionLoading(true)
    setActionMsg('')
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        'http://localhost:5000/api/matches/' + id + '/join',
        {},
        { headers: { Authorization: 'Bearer ' + token } }
      )
      setJoinStatus('pending')
      setActionMsg('Request sent — waiting for organizer approval.')
      await refetchMatch()
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Could not send request.')
    } finally {
      setActionLoading(false)
    }
  }

  // Leave match or cancel request — calls backend API
  async function handleLeave() {
    setActionLoading(true)
    setActionMsg('')
    try {
      const token = localStorage.getItem('token')
      await axios.delete(
        'http://localhost:5000/api/matches/' + id + '/leave',
        { headers: { Authorization: 'Bearer ' + token } }
      )
      setJoinStatus('none')
      setActionMsg('You have left this match.')
      await refetchMatch()
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Could not leave match.')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="match-detail-page">

      <Navbar role={role} setRole={setRole} />

      <div className="match-detail-content">

        {/* Back button */}
        <button className="back-btn" onClick={function () { navigate('/') }}>
          Back to Matches
        </button>

        {/* Match Header Card */}
        <div className="detail-header-card">

          <h1 className="detail-title">{match.title}</h1>

          <div className="detail-address-row">
            <IconLocation size={14} color="#9CA3AF" />
            <span>{match.venue} — {match.address}</span>

            <a href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(match.address || '')}
              target="_blank"
              rel="noreferrer"
            >
              Get Directions
            </a>
          </div>

          <div className="detail-chips">
            <div className="detail-chip">
              <IconCalendar size={12} color="#6B7280" />
              {formattedDate}
            </div>
            <div className="detail-chip">
              <IconClock size={12} color="#6B7280" />
              {match.time || 'TBD'}
            </div>
            <span className={getSkillClass(match.skillLevel)}>
              {match.skillLevel}
            </span>
            <div className="detail-chip">
              <IconUser size={12} color="#6B7280" />
              {emptySlots} spots left
            </div>
          </div>

          <div className="detail-organizer">
            Organized by <strong>{match.organizer?.name || 'Organizer'}</strong>
          </div>

          {match.description && (
            <p className="detail-description">{match.description}</p>
          )}

        </div>

        {/*  Weather API is connected in a later step */}

        {/* Player Slots */}
        <div className="slots-card">
          <h3>Players ({confirmedPlayers.length}/{match.maxPlayers})</h3>
          <div className="slots-grid">

            {/* Real confirmed players from MongoDB */}
            {confirmedPlayers.map(function (player, i) {
              const name = player.user?.name || 'Player'
              const initials = name.split(' ').map(function (n) { return n[0] }).join('').toUpperCase().slice(0, 2)
              const isOrganizer = (player.user?._id || player.user) === (match.organizer?._id?.toString() || match.organizer?.toString())
              return (
                <div key={i} className="slot-filled">
                  <div className={isOrganizer ? 'slot-avatar organizer' : 'slot-avatar'}>
                    {initials}
                  </div>
                  <p>{name.split(' ')[0]}</p>
                  {isOrganizer && <small>Organizer</small>}
                </div>
              )
            })}

            {/* Empty slots */}
            {Array.from({ length: emptySlots }).map(function (_, i) {
              return (
                <div key={'empty-' + i} className="slot-empty">
                  <div className="slot-empty-circle">+</div>
                  <p>Open</p>
                </div>
              )
            })}

          </div>
        </div>

        {/* Match Chat */}
        <div className="chat-card">

          <div className="chat-header">
            <h3>Match Chat</h3>
            <span>{confirmedPlayers.length} participants</span>
          </div>

          <div className="chat-messages">
            {messages.map(function (msg) {
              return (
                <div key={msg.id} className={msg.own ? 'chat-message own' : 'chat-message other'}>
                  {!msg.own && <span className="chat-sender">{msg.sender}</span>}
                  <div className={msg.own ? 'chat-bubble own' : 'chat-bubble other'}>
                    {msg.text}
                  </div>
                  <span className="chat-time">{msg.time}</span>
                </div>
              )
            })}
          </div>

          <div className="chat-input-row">
            <input
              type="text"
              placeholder="Type a message..."
              value={chatInput}
              onChange={function (e) { setChatInput(e.target.value) }}
              onKeyDown={function (e) { if (e.key === 'Enter') handleSend() }}
            />
            <button className="btn-send" onClick={handleSend}>Send</button>
          </div>

        </div>

      </div>

      {/* Sticky Bottom Bar */}
      <div className="sticky-bottom">
        <div className="sticky-bottom-inner">

          {/* Action message after join or leave */}
          {actionMsg && (
            <p style={{ textAlign: 'center', fontSize: 13, color: '#16A34A', fontWeight: 600, marginBottom: 8 }}>
              {actionMsg}
            </p>
          )}

          {/* Player has not joined and match is not full */}
          {joinStatus === 'none' && !isFull && role === 'Player' && (
            <button
              className="btn-request-join"
              onClick={handleJoinRequest}
              disabled={actionLoading}
              style={{ opacity: actionLoading ? 0.6 : 1 }}
            >
              {actionLoading ? 'Sending...' : 'Request to Join'}
            </button>
          )}

          {/* Match is full */}
          {joinStatus === 'none' && isFull && (
            <div className="left-bar">This match is full</div>
          )}

          {/* Request is pending */}
          {joinStatus === 'pending' && (
            <div className="pending-bar">
              <div className="pending-status">
                <IconCheck size={16} color="#16A34A" />
                Request sent — waiting for organizer approval
              </div>
              <button
                className="btn-cancel-request"
                onClick={function () { setShowLeaveModal(true) }}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Player is confirmed — show leave button */}
          {joinStatus === 'confirmed' && (
            <button
              className="btn-request-join"
              onClick={function () { setShowLeaveModal(true) }}
              disabled={actionLoading}
              style={{ background: '#DC2626', opacity: actionLoading ? 0.6 : 1 }}
            >
              {actionLoading ? 'Leaving...' : 'Leave Match'}
            </button>
          )}

          {/* Organizer view */}
          {role === 'Organizer' && (
            <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 10, padding: 14, textAlign: 'center', color: '#15803D', fontWeight: 600, fontSize: 14 }}>
              Switch to Manage Match to control this match
            </div>
          )}

          {/* Venue Host view */}
          {role === 'Venue Host' && (
            <div style={{ background: '#F3F4F6', borderRadius: 10, padding: 14, textAlign: 'center', color: '#6B7280', fontWeight: 600, fontSize: 14 }}>
              Venue host view only
            </div>
          )}

        </div>
      </div>

      {/* Leave Confirmation Modal */}
      {showLeaveModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{joinStatus === 'pending' ? 'Cancel your request?' : 'Leave this match?'}</h3>
            <p>{joinStatus === 'pending' ? 'Your join request will be removed.' : 'Your spot will be freed up and the organizer will be notified.'}</p>
            <div className="modal-buttons">
              <button
                className="btn-modal-cancel"
                onClick={function () { setShowLeaveModal(false) }}
              >
                {joinStatus === 'pending' ? 'Keep Request' : 'Stay'}
              </button>
              <button
                className="btn-modal-confirm"
                onClick={async function () {
                  setShowLeaveModal(false)
                  await handleLeave()
                }}
              >
                {joinStatus === 'pending' ? 'Cancel Request' : 'Leave Match'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

    </div>
  )
}

export default MatchDetailPage