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

  // Active tab state
  const [activeTab, setActiveTab] = useState('upcoming')

  // Real matches from backend
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Matches this user created as organizer
  const [myCreatedMatches, setMyCreatedMatches] = useState([])

  // Get logged in user id to find their player entry status in each match
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const currentUserId = currentUser.id || currentUser._id

  // Fetch matches the player has joined when page loads
  useEffect(function () {
    async function fetchMyMatches() {
      try {
        const token = localStorage.getItem('token')

        // Matches the player has joined
        const res = await axios.get('http://localhost:5000/api/matches/my-matches', {
          headers: { Authorization: 'Bearer ' + token }
        })
        setMatches(res.data.matches)

        // Matches this user created as organizer
        if (role === 'Organizer') {
          const allRes = await axios.get('http://localhost:5000/api/matches')
          const created = allRes.data.matches.filter(function (m) {
            return (m.organizer?._id || m.organizer) === currentUserId
          })
          setMyCreatedMatches(created)
        }

      } catch (err) {
        setError('Could not load your matches.')
      } finally {
        setLoading(false)
      }
    }
    fetchMyMatches()
  }, [])

  // Format matches into the three tabs based on player status and match status
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

  // Cancel a pending request — calls backend leave API
  async function handleCancelRequest(matchId) {
    try {
      const token = localStorage.getItem('token')
      await axios.delete('http://localhost:5000/api/matches/' + matchId + '/leave', {
        headers: { Authorization: 'Bearer ' + token }
      })
      // Remove it from local state immediately
      setMatches(matches.filter(function (m) { return m._id !== matchId }))
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel request.')
    }
  }

  // Skill badge class
  function getSkillClass(level) {
    if (level === 'Beginner') return 'skill-badge skill-beginner'
    if (level === 'Intermediate') return 'skill-badge skill-intermediate'
    return 'skill-badge skill-advanced'
  }

  // Format date helper
  function formatDate(dateStr) {
    if (!dateStr) return 'TBD'
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
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

        {role !== 'Organizer' && (
          <>
            {/* Tab bar */}
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
                    const attended = myEntry?.status === 'confirmed'

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
  
        
        {/* Matches I Created — only shown for Organizers */}
        {role === 'Organizer' && myCreatedMatches.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 16 }}>
              Matches I Created
            </h2>
            {myCreatedMatches.map(function (match) {
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

      </div>

      <Footer />

    </div>
  )
}

export default MyMatchesPage


// Empty state component
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