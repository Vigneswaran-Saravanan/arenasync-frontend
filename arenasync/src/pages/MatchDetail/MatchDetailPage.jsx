import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './MatchDetailPage.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import IconLocation from '../../components/icons/IconLocation'
import IconCalendar from '../../components/icons/IconCalendar'
import IconClock from '../../components/icons/IconClock'
import IconUser from '../../components/icons/IconUser'
import IconCheck from '../../components/icons/IconCheck'
import matches from '../../data/matches'

function MatchDetailPage({ role, setRole }) {

  const { id } = useParams()
  const navigate = useNavigate()

  // Find the match by id from URL
  const match = matches.find(function(m) {
    return m.id === parseInt(id)
  })

  // Join status: 'none', 'pending', 'left'
  const [joinStatus, setJoinStatus] = useState('none')

  // Chat messages
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Carlos Mendez', text: 'Hey everyone, see you Sunday! Bring water.', time: '9:00 AM', own: false },
    { id: 2, sender: 'Aiden Park', text: 'Will do! Which entrance?', time: '9:15 AM', own: false },
  ])

  // Show leave confirmation dialog
  const [showLeaveModal, setShowLeaveModal] = useState(false)

  // If match not found
  if (!match) {
    return (
      <div className="match-detail-page">
        <Navbar role={role} setRole={setRole} />
        <div style={{ padding: 60, textAlign: 'center' }}>
          <h2>Match not found</h2>
          <button
            onClick={function() { navigate('/') }}
            style={{ marginTop: 16, padding: '10px 24px', background: '#16A34A', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // Confirmed players dummy data
  const confirmedPlayers = [
    { id: 1, name: 'Carlos Mendez', initials: 'CM', isOrganizer: true },
    { id: 2, name: 'Aiden Park', initials: 'AP' },
    { id: 3, name: 'Marcus Cole', initials: 'MC' },
    { id: 4, name: 'Reza Tehrani', initials: 'RT' },
    { id: 5, name: 'Sophie Lane', initials: 'SL' },
  ]

  const emptySlots = match.maxPlayers - confirmedPlayers.length

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

  // Weather icon
  const weatherIcon = (match.weather.condition === 'Sunny' || match.weather.condition === 'Clear') ? '☀️' : '🌥️'

  return (
    <div className="match-detail-page">

      <Navbar role={role} setRole={setRole} />

      <div className="match-detail-content">

        {/* Back button */}
        <button className="back-btn" onClick={function() { navigate('/') }}>
          ← Back to Matches
        </button>

        {/* Match Header Card */}
        <div className="detail-header-card">

          <h1 className="detail-title">{match.title}</h1>

          <div className="detail-address-row">
            <IconLocation size={14} color="#9CA3AF" />
            <span>{match.address}</span>
            
              <a href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(match.address)}
              target="_blank"
              rel="noreferrer"
            >
              Get Directions →
            </a>
          </div>

          <div className="detail-chips">
            <div className="detail-chip">
              <IconCalendar size={12} color="#6B7280" />
              {match.dateLabel}
            </div>
            <div className="detail-chip">
              <IconClock size={12} color="#6B7280" />
              {match.time}
            </div>
            <span className={getSkillClass(match.skillLevel)}>
              {match.skillLevel}
            </span>
            <div className="detail-chip">
              <IconUser size={12} color="#6B7280" />
              {match.spotsLeft} spots left
            </div>
          </div>

          <div className="detail-organizer">
            Organized by <strong>{match.organizer}</strong>
          </div>

          {match.description && (
            <p className="detail-description">{match.description}</p>
          )}

        </div>

        {/* Weather Strip */}
        <div className="weather-strip">
          <span className="weather-icon">{weatherIcon}</span>
          <div>
            <p className="weather-temp">{match.weather.temp}</p>
            <p className="weather-condition">{match.weather.condition}</p>
          </div>
          <div className="weather-right">
            <p>Match Day</p>
            <p>{match.dateLabel}</p>
          </div>
        </div>

        {/* Player Slots */}
        <div className="slots-card">
          <h3>Players ({confirmedPlayers.length}/{match.maxPlayers})</h3>
          <div className="slots-grid">

            {confirmedPlayers.map(function(player) {
              return (
                <div key={player.id} className="slot-filled">
                  <div className={player.isOrganizer ? 'slot-avatar organizer' : 'slot-avatar'}>
                    {player.initials}
                  </div>
                  <p>{player.name.split(' ')[0]}</p>
                  {player.isOrganizer && <small>Organizer</small>}
                </div>
              )
            })}

            {Array.from({ length: emptySlots }).map(function(_, i) {
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
            {messages.map(function(msg) {
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
              onChange={function(e) { setChatInput(e.target.value) }}
              onKeyDown={function(e) { if (e.key === 'Enter') handleSend() }}
            />
            <button className="btn-send" onClick={handleSend}>Send</button>
          </div>

        </div>

      </div>

      {/* Sticky Bottom Bar */}
      <div className="sticky-bottom">
        <div className="sticky-bottom-inner">

          {joinStatus === 'none' && (
            <button
              className="btn-request-join"
              onClick={function() { setJoinStatus('pending') }}
            >
              Request to Join
            </button>
          )}

          {joinStatus === 'pending' && (
            <div className="pending-bar">
              <div className="pending-status">
                <IconCheck size={16} color="#16A34A" />
                Request sent — waiting for organizer approval
              </div>
              <button
                className="btn-cancel-request"
                onClick={function() { setShowLeaveModal(true) }}
              >
                Cancel
              </button>
            </div>
          )}

          {joinStatus === 'left' && (
            <div className="left-bar">
              You have left this match
            </div>
          )}

        </div>
      </div>

      {/* Leave Confirmation Modal */}
      {showLeaveModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Cancel your request?</h3>
            <p>Your join request will be removed.</p>
            <div className="modal-buttons">
              <button
                className="btn-modal-cancel"
                onClick={function() { setShowLeaveModal(false) }}
              >
                Keep Request
              </button>
              <button
                className="btn-modal-confirm"
                onClick={function() {
                  setJoinStatus('left')
                  setShowLeaveModal(false)
                }}
              >
                Cancel Request
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