import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './HomePage.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import IconLocation from '../../components/icons/IconLocation'
import IconCalendar from '../../components/icons/IconCalendar'
import IconClock from '../../components/icons/IconClock'
import IconUser from '../../components/icons/IconUser'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function HomePage({ role, setRole }) {

  const navigate = useNavigate()

  const [skillFilter, setSkillFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('All')
  const [locationSearch, setLocationSearch] = useState('')
  const [joinedMatches, setJoinedMatches] = useState([])
  const [toast, setToast] = useState(null)
  const [selectedPin, setSelectedPin] = useState(null)
  // Real matches from backend
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch matches from backend when page loads
  useEffect(function () {
    async function fetchMatches() {
      try {
        setLoading(true)
        const response = await axios.get(API_URL + '/api/matches')
        setMatches(response.data.matches)
      } catch (err) {
        setError('Failed to load matches. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
  }, [])

  // Format backend data to match what components expect
  const formattedMatches = matches.map(function (match) {
    const confirmedPlayers = match.players.filter(function (p) {
      return p.status === 'confirmed'
    })
    return {
      id: match._id,
      title: match.title,
      venue: match.venue,
      address: match.address,
      date: match.date,
      dateLabel: new Date(match.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }),
      time: match.time,
      skillLevel: match.skillLevel,
      maxPlayers: match.maxPlayers,
      spotsLeft: match.maxPlayers - confirmedPlayers.length,
      organizer: match.organizer ? match.organizer.name : 'Unknown',
      weather: match.weather || { temp: '20°C', condition: 'Clear' },
      tag: null,
      description: match.description,
      pin: match.pin || { top: '50%', left: '50%' },
    }
  })

  // Filter matches based on all three filters
  const filtered = formattedMatches.filter(function (match) {

    // Skill filter
    if (skillFilter !== 'All' && match.skillLevel !== skillFilter) {
      return false
    }

    // Location search filter
    if (locationSearch.trim() !== '') {
      const search = locationSearch.toLowerCase()
      const inVenue = match.venue.toLowerCase().includes(search)
      const inAddress = match.address.toLowerCase().includes(search)
      const inTitle = match.title.toLowerCase().includes(search)
      if (!inVenue && !inAddress && !inTitle) return false
    }

    // Date filter
    if (dateFilter === 'All') return true

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const matchDate = new Date(match.date)
    matchDate.setHours(0, 0, 0, 0)

    if (dateFilter === 'Today') {
      return matchDate.getTime() === today.getTime()
    }

    if (dateFilter === 'Tomorrow') {
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)
      return matchDate.getTime() === tomorrow.getTime()
    }

    if (dateFilter === 'This Week') {
      const weekLater = new Date(today)
      weekLater.setDate(today.getDate() + 7)
      return matchDate >= today && matchDate <= weekLater
    }

    return true
  })

  // Handle join button
  function handleJoin(matchId, matchTitle) {
    if (joinedMatches.includes(matchId)) return
    setJoinedMatches([...joinedMatches, matchId])
    setToast('Join request sent for ' + matchTitle)
    setTimeout(function () { setToast(null) }, 3000)
  }

  return (
    <div className="homepage">

      <Navbar role={role} setRole={setRole} />

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-bar-inner">

          <span className="filter-label">Skill Level</span>

          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(function (level) {
            return (
              <button
                key={level}
                className={skillFilter === level ? 'filter-chip active' : 'filter-chip'}
                onClick={function () { setSkillFilter(level) }}
              >
                {level}
              </button>
            )
          })}

          <div className="filter-divider" />

          <span className="filter-label">Date</span>

          {['All', 'Today', 'Tomorrow', 'This Week'].map(function (d) {
            return (
              <button
                key={d}
                className={dateFilter === d ? 'filter-chip active' : 'filter-chip'}
                onClick={function () { setDateFilter(d) }}
              >
                {d}
              </button>
            )
          })}

          <div className="filter-search">
            <IconLocation size={14} color="#9CA3AF" />
            <input
              type="text"
              placeholder="Search location..."
              value={locationSearch}
              onChange={function (e) { setLocationSearch(e.target.value) }}
            />
          </div>

        </div>
      </div>

      {/* Two Panel Layout */}
      <div className="main-panels">

        {/* Left Panel */}
        <div className="left-panel">

          <div className="panel-heading-row">
            <h2 className="panel-heading">Matches Near You</h2>
            <span className="panel-count">{filtered.length} matches found</span>
          </div>

          {/* Loading state */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#6B7280' }}>
              Loading matches...
            </div>
          )}

          {/* Error state */}
          {error && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#DC2626' }}>
              {error}
            </div>
          )}

          {/* Added !loading && !error && */}
          {!loading && !error && filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <IconLocation size={22} color="#9CA3AF" />
              </div>
              <h3>No matches found</h3>
              <p>Try a different filter</p>
            </div>
          ) : (
            <div className="cards-list">
              {filtered.map(function (match) {
                return (
                  <MatchCard
                    key={match.id}
                    match={match}
                    joined={joinedMatches.includes(match.id)}
                    onJoin={handleJoin}
                    onView={function () { navigate('/match/' + match.id) }}
                    role={role}
                  />
                )
              })}
            </div>
          )}

        </div>

        {/* Right Panel — Map */}
        <div className="right-panel">
          <MapPanel
            matches={filtered}
            selectedPin={selectedPin}
            setSelectedPin={setSelectedPin}
            onPinView={function (id) { navigate('/match/' + id) }}
          />
        </div>

      </div>

      <Footer />

      {toast && <div className="toast">{toast}</div>}

    </div>
  )
}

export default HomePage


// Match Card 
function MatchCard({ match, joined, onJoin, onView, role }) {

  const filled = match.maxPlayers - match.spotsLeft
  const percent = (filled / match.maxPlayers) * 100

  function getSkillClass(level) {
    if (level === 'Beginner') return 'skill-badge skill-beginner'
    if (level === 'Intermediate') return 'skill-badge skill-intermediate'
    return 'skill-badge skill-advanced'
  }

  function getTagClass(tag) {
    if (tag === 'Popular') return 'match-tag tag-popular'
    if (tag === 'New') return 'match-tag tag-new'
    return 'match-tag tag-filling-fast'
  }

  return (
    <div className="match-card" onClick={onView}>

      <div className="match-card-top">
        {match.tag ? (
          <span className={getTagClass(match.tag)}>{match.tag}</span>
        ) : (
          <span />
        )}
        <span className="match-price">
          Free <span>per player</span>
        </span>
      </div>

      <h3 className="match-title">{match.title}</h3>

      <div className="match-venue">
        <IconLocation size={13} color="#9CA3AF" />
        <span>{match.venue}</span>
      </div>

      <div className="match-info-row">
        <div className="match-info-item">
          <IconCalendar size={12} color="#9CA3AF" />
          <span>{match.dateLabel}</span>
        </div>
        <span className="info-divider">|</span>
        <div className="match-info-item">
          <IconClock size={12} color="#9CA3AF" />
          <span>{match.time}</span>
        </div>
        <span className="info-divider">|</span>
        <span className={getSkillClass(match.skillLevel)}>
          {match.skillLevel}
        </span>
      </div>

      <div className="match-spots">
        <IconUser size={12} color="#9CA3AF" />
        <span>
          <strong>{match.spotsLeft}</strong> of <strong>{match.maxPlayers}</strong> spots left
        </span>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: percent + '%' }} />
      </div>

      <div className="match-card-bottom">
        {/* <span className="match-weather">
          {match.weather.temp} · {match.weather.condition}
        </span> */}
        <div className="match-buttons">
          <button className="btn-join" onClick={function (e) { e.stopPropagation(); onView() }}>
            View & Join
          </button>
        </div>

      </div>

    </div>
  )
}


// Map Panel 
function MapPanel({ matches, selectedPin, setSelectedPin, onPinView }) {

  const [zoom, setZoom] = useState(1)

  function zoomIn() {
    setZoom(function (z) { return Math.min(z + 0.2, 2.2) })
  }

  function zoomOut() {
    setZoom(function (z) { return Math.max(z - 0.2, 0.6) })
  }

  return (
    <div className="map-container">

      <div className="map-zoomable" style={{ transform: 'scale(' + zoom + ')' }}>

        <svg className="map-svg-grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (i) {
            return <line key={'h' + i} x1="0" y1={i * 10 + '%'} x2="100%" y2={i * 10 + '%'} stroke="#86efac" strokeWidth="1" />
          })}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (i) {
            return <line key={'v' + i} x1={i * 10 + '%'} y1="0" x2={i * 10 + '%'} y2="100%" stroke="#86efac" strokeWidth="1" />
          })}
        </svg>

        <svg className="map-svg-roads">
          <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#4ade80" strokeWidth="6" />
          <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#4ade80" strokeWidth="6" />
          <line x1="0" y1="65%" x2="100%" y2="65%" stroke="#4ade80" strokeWidth="3" />
          <line x1="65%" y1="0" x2="65%" y2="100%" stroke="#4ade80" strokeWidth="3" />
        </svg>

        {matches.map(function (match) {
          return (
            <div
              key={match.id}
              className="map-pin-wrapper"
              style={{ top: match.pin.top, left: match.pin.left }}
              onMouseEnter={function () { setSelectedPin(match.id) }}
              onMouseLeave={function () { setSelectedPin(null) }}
              onClick={function () { onPinView(match.id) }}
            >
              <div className={selectedPin === match.id ? 'map-pin-circle selected' : 'map-pin-circle'}>
                <div className="map-pin-dot" />
              </div>

              {selectedPin === match.id && (
                <div className="map-pin-popup">
                  <h4>{match.title}</h4>
                  <p>{match.time} · {match.spotsLeft} spots left</p>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#16A34A' }}>
                    Click to view →
                  </span>
                </div>
              )}
            </div>
          )
        })}

      </div>

      <div className="map-city-label">
        <IconLocation size={13} color="#16A34A" />
        Toronto, ON
      </div>

      <div className="map-zoom-controls">
        <button className="map-zoom-btn" onClick={zoomIn} disabled={zoom >= 2.2}>+</button>
        <div className="map-zoom-divider" />
        <button className="map-zoom-btn" onClick={zoomOut} disabled={zoom <= 0.6}>−</button>
      </div>

    </div>
  )
}