import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './MyMatchesPage.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import IconCalendar from '../../components/icons/IconCalendar'
import IconClock from '../../components/icons/IconClock'
import IconLocation from '../../components/icons/IconLocation'

function MyMatchesPage({ role, setRole }) {

  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('upcoming')

  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // All matches the organizer created (all statuses)
  const [myCreatedMatches, setMyCreatedMatches] = useState([])

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const currentUserId = currentUser.id || currentUser._id

  useEffect(function () {
    async function fetchMyMatches() {
      try {
        const token = localStorage.getItem('token')

        if (role === 'Organizer') {
          // Use the new endpoint that returns ALL statuses
          const res = await axios.get('http://localhost:5000/api/matches/my-created', {
            headers: { Authorization: 'Bearer ' + token }
          })
          setMyCreatedMatches(res.data.matches)
        } else {
          // Player — fetch matches they joined
          const res = await axios.get('http://localhost:5000/api/matches/my-matches', {
            headers: { Authorization: 'Bearer ' + token }
          })
          setMatches(res.data.matches)
        }

      } catch (err) {
        setError('Could not load your matches.')
      } finally {
        setLoading(false)
      }
    }
    fetchMyMatches()
  }, [])

  // Player tabs
  const upcomingMatches = matches.filter(function (m) {
    const myEntry = m.players?.find(function (p) {
      return (p.user?._id?.toString() || p.user?.toString()) === currentUserId?.toString()
    })
    return myEntry?.status === 'confirmed' && m.status === 'Upcoming'
  })

  const pendingMatches = matches.filter(function (m) {
    const myEntry = m.players?.find(function (p) {
      return (p.user?._id?.toString() || p.user?.toString()) === currentUserId?.toString()
    })
    return myEntry?.status === 'pending'
  })

  const completedMatches = matches.filter(function (m) {
    return m.status === 'Completed'
  })

  // Organizer tabs
  const organizerUpcoming = myCreatedMatches.filter(function (m) {
    return m.status === 'Upcoming' || m.status === 'Ongoing'
  })

  const organizerCompleted = myCreatedMatches.filter(function (m) {
    return m.status === 'Completed' || m.status === 'Cancelled'
  })

  // Check if a match is today
  function isToday(dateStr) {
    // Use UTC date parts to avoid timezone shift
    const matchDate = new Date(dateStr)
    const today = new Date()
    return (
      matchDate.getUTCFullYear() === today.getUTCFullYear() &&
      matchDate.getUTCMonth() === today.getUTCMonth() &&
      matchDate.getUTCDate() === today.getUTCDate()
    )
  }
  async function handleCancelRequest(matchId) {
    try {
      const token = localStorage.getItem('token')
      await axios.delete('http://localhost:5000/api/matches/' + matchId + '/leave', {
        headers: { Authorization: 'Bearer ' + token }
      })
      setMatches(matches.filter(function (m) { return m._id !== matchId }))
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel request.')
    }
  }

  function getSkillClass(level) {
    if (level === 'Beginner') return 'skill-badge skill-beginner'
    if (level === 'Intermediate') return 'skill-badge skill-intermediate'
    return 'skill-badge skill-advanced'
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'TBD'
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    })
  }

  if (loading) {
    return (
      <div className="my-matches-page">
        <Navbar role={role} setRole={setRole} />
        <div style={{ padding: 60, textAlign: 'center', color: '#6B7280' }}>Loading your matches...</div>
      </div>
    )
  }

  return (
    <div className="my-matches-page">

      <Navbar role={role} setRole={setRole} />

      <div className="my-matches-content">

        <h1 className="my-matches-heading">My Matches</h1>
        <p className="my-matches-subheading">
          {role === 'Organizer' ? 'Manage the matches you have created' : 'Track all your upcoming and past games'}
        </p>

        {error && (
          <p style={{ color: '#DC2626', marginBottom: 16 }}>{error}</p>
        )}

        {/* ── ORGANIZER VIEW ── */}
        {role === 'Organizer' && (
          <>
            <div className="tab-bar">
              <button
                className={activeTab === 'upcoming' ? 'tab-btn active' : 'tab-btn'}
                onClick={function () { setActiveTab('upcoming') }}
              >
                Upcoming
                <span className="tab-count">{organizerUpcoming.length}</span>
              </button>
              <button
                className={activeTab === 'completed' ? 'tab-btn active' : 'tab-btn'}
                onClick={function () { setActiveTab('completed') }}
              >
                Completed
                <span className="tab-count">{organizerCompleted.length}</span>
              </button>
            </div>

            {/* Organizer Upcoming tab */}
            {activeTab === 'upcoming' && (
              <div>
                {organizerUpcoming.length === 0 ? (
                  <EmptyState
                    message="No upcoming matches"
                    sub="Create a match to get started"
                    showBtn={false}
                  />
                ) : (
                  <>
                    {/* Today's matches */}
                    {organizerUpcoming.filter(function (m) { return isToday(m.date) }).length > 0 && (
                      <div className="matches-section">
                        <p className="matches-section-label">Today</p>
                        {organizerUpcoming.filter(function (m) { return isToday(m.date) }).map(function (match) {
                          return (
                            <div key={match._id}>
                              <div className="today-hint">
                                This match is today — after it ends, go to Manage and mark it as Completed, then record attendance for your players.
                              </div>
                              <div className="match-row-card match-today">
                                <div className="match-row-info">
                                  <h3 className="match-row-title">{match.title}</h3>
                                  <p className="match-row-venue">{match.venue}</p>
                                  <div className="match-row-meta">
                                    <span>
                                      <IconCalendar size={12} color="#9CA3AF" />
                                      {formatDate(match.date)}
                                    </span>
                                    <span>
                                      <IconClock size={12} color="#9CA3AF" />
                                      {match.time}
                                    </span>
                                    <span className={getSkillClass(match.skillLevel)}>
                                      {match.skillLevel}
                                    </span>
                                  </div>
                                </div>
                                <div className="match-row-actions">
                                  <span className="status-badge status-confirmed">{match.status}</span>
                                  <button
                                    className="btn-view-match"
                                    onClick={function () { navigate('/organizer-match/' + match._id) }}
                                  >
                                    Manage
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Future matches */}
                    {organizerUpcoming.filter(function (m) { return !isToday(m.date) }).length > 0 && (
                      <div className="matches-section">
                        {organizerUpcoming.filter(function (m) { return isToday(m.date) }).length > 0 && (
                          <p className="matches-section-label">Coming Up</p>
                        )}
                        {organizerUpcoming.filter(function (m) { return !isToday(m.date) }).map(function (match) {
                          return (
                            <div key={match._id} className="match-row-card">
                              <div className="match-row-info">
                                <h3 className="match-row-title">{match.title}</h3>
                                <p className="match-row-venue">{match.venue}</p>
                                <div className="match-row-meta">
                                  <span>
                                    <IconCalendar size={12} color="#9CA3AF" />
                                    {formatDate(match.date)}
                                  </span>
                                  <span>
                                    <IconClock size={12} color="#9CA3AF" />
                                    {match.time}
                                  </span>
                                  <span className={getSkillClass(match.skillLevel)}>
                                    {match.skillLevel}
                                  </span>
                                </div>
                              </div>
                              <div className="match-row-actions">
                                <span className="status-badge status-confirmed">{match.status}</span>
                                <button
                                  className="btn-view-match"
                                  onClick={function () { navigate('/organizer-match/' + match._id) }}
                                >
                                  Manage
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Organizer Completed tab */}
            {activeTab === 'completed' && (
              <div>
                {organizerCompleted.length === 0 ? (
                  <EmptyState
                    message="No completed matches"
                    sub="Your finished matches will appear here"
                    showBtn={false}
                  />
                ) : (
                  organizerCompleted.map(function (match) {
                    return (
                      <div key={match._id} className="match-row-card">
                        <div className="match-row-info">
                          <h3 className="match-row-title">{match.title}</h3>
                          <p className="match-row-venue">{match.venue}</p>
                          <div className="match-row-meta">
                            <span>
                              <IconCalendar size={12} color="#9CA3AF" />
                              {formatDate(match.date)}
                            </span>
                            <span>
                              <IconClock size={12} color="#9CA3AF" />
                              {match.time}
                            </span>
                            <span className={getSkillClass(match.skillLevel)}>
                              {match.skillLevel}
                            </span>
                          </div>
                        </div>
                        <div className="match-row-actions">
                          <span className="status-badge status-completed">{match.status}</span>
                          <button
                            className="btn-view-match"
                            onClick={function () { navigate('/organizer-match/' + match._id) }}
                          >
                            Manage
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </>
        )}

        {/* ── PLAYER VIEW ── */}
        {role !== 'Organizer' && (
          <>
            <div className="tab-bar">
              <button
                className={activeTab === 'upcoming' ? 'tab-btn active' : 'tab-btn'}
                onClick={function () { setActiveTab('upcoming') }}
              >
                Upcoming
                <span className="tab-count">{upcomingMatches.length}</span>
              </button>
              <button
                className={activeTab === 'pending' ? 'tab-btn active' : 'tab-btn'}
                onClick={function () { setActiveTab('pending') }}
              >
                Pending
                <span className="tab-count">{pendingMatches.length}</span>
              </button>
              <button
                className={activeTab === 'completed' ? 'tab-btn active' : 'tab-btn'}
                onClick={function () { setActiveTab('completed') }}
              >
                Completed
                <span className="tab-count">{completedMatches.length}</span>
              </button>
            </div>

            {/* Upcoming Tab */}
            {activeTab === 'upcoming' && (
              <div>
                {upcomingMatches.length === 0 ? (
                  <EmptyState
                    message="No upcoming matches"
                    sub="Find a match and send a join request"
                    showBtn={true}
                    onBtnClick={function () { navigate('/') }}
                  />
                ) : (
                  upcomingMatches.map(function (match) {
                    return (
                      <div key={match._id} className="match-row-card">
                        <div className="match-row-info">
                          <h3 className="match-row-title">{match.title}</h3>
                          <p className="match-row-venue">{match.venue}</p>
                          <div className="match-row-meta">
                            <span>
                              <IconCalendar size={12} color="#9CA3AF" />
                              {formatDate(match.date)}
                            </span>
                            <span>
                              <IconClock size={12} color="#9CA3AF" />
                              {match.time}
                            </span>
                            <span className={getSkillClass(match.skillLevel)}>
                              {match.skillLevel}
                            </span>
                          </div>
                        </div>
                        <div className="match-row-actions">
                          <span className="status-badge status-confirmed">Confirmed</span>
                          <button
                            className="btn-view-match"
                            onClick={function () { navigate('/match/' + match._id) }}
                          >
                            View Match
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}

            {/* Pending Tab */}
            {activeTab === 'pending' && (
              <div>
                {pendingMatches.length === 0 ? (
                  <EmptyState
                    message="No pending requests"
                    sub="Browse matches and send a join request"
                    showBtn={true}
                    onBtnClick={function () { navigate('/') }}
                  />
                ) : (
                  pendingMatches.map(function (match) {
                    return (
                      <div key={match._id} className="match-row-card">
                        <div className="match-row-info">
                          <h3 className="match-row-title">{match.title}</h3>
                          <p className="match-row-venue">{match.venue}</p>
                          <div className="match-row-meta">
                            <span>
                              <IconCalendar size={12} color="#9CA3AF" />
                              {formatDate(match.date)}
                            </span>
                            <span>
                              <IconClock size={12} color="#9CA3AF" />
                              {match.time}
                            </span>
                            <span className={getSkillClass(match.skillLevel)}>
                              {match.skillLevel}
                            </span>
                          </div>
                        </div>
                        <div className="match-row-actions">
                          <span className="status-badge status-pending">Pending Approval</span>
                          <button
                            className="btn-cancel-req"
                            onClick={function () { handleCancelRequest(match._id) }}
                          >
                            Cancel Request
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}

            {/* Completed Tab */}
            {activeTab === 'completed' && (
              <div>
                {completedMatches.length === 0 ? (
                  <EmptyState
                    message="No completed matches"
                    sub="Your finished matches will appear here"
                    showBtn={false}
                  />
                ) : (
                  completedMatches.map(function (match) {
                    const myEntry = match.players?.find(function (p) {
                      return (p.user?._id?.toString() || p.user?.toString()) === currentUserId?.toString()
                    })
                    const attended = myEntry?.attended === true

                    return (
                      <div key={match._id} className="match-row-card">
                        <div className="match-row-info">
                          <h3 className="match-row-title">{match.title}</h3>
                          <p className="match-row-venue">{match.venue}</p>
                          <div className="match-row-meta">
                            <span>
                              <IconCalendar size={12} color="#9CA3AF" />
                              {formatDate(match.date)}
                            </span>
                            <span>
                              <IconClock size={12} color="#9CA3AF" />
                              {match.time}
                            </span>
                            <span className={getSkillClass(match.skillLevel)}>
                              {match.skillLevel}
                            </span>
                          </div>
                        </div>
                        <div className="match-row-actions">
                          <span className="status-badge status-completed">Completed</span>
                          {attended
                            ? <span className="status-badge status-attended">Attended</span>
                            : <span className="status-badge status-absent">Absent</span>
                          }
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </>
        )}

      </div>

      <Footer />

    </div>
  )
}

export default MyMatchesPage

function EmptyState({ message, sub, showBtn, onBtnClick }) {
  return (
    <div className="tab-empty">
      <div className="tab-empty-icon">
        <IconLocation size={24} color="#9CA3AF" />
      </div>
      <h3>{message}</h3>
      <p>{sub}</p>
      {showBtn && (
        <button className="btn-find-match" onClick={onBtnClick}>
          Find a Match
        </button>
      )}
    </div>
  )
}