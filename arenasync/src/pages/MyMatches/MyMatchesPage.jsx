import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

  // Dummy data for upcoming matches
  const upcomingMatches = [
    {
      id: 1,
      title: 'Sunday Morning Kickabout',
      venue: 'Christie Pits Park',
      dateLabel: 'Sun, Jun 7',
      time: '10:00 AM',
      skillLevel: 'Beginner',
      status: 'confirmed',
    },
    {
      id: 2,
      title: 'Wednesday Evening 5-a-side',
      venue: 'Lamport Stadium',
      dateLabel: 'Wed, Jun 4',
      time: '7:00 PM',
      skillLevel: 'Intermediate',
      status: 'confirmed',
    },
  ]

  // Dummy data for pending matches
  // This is what players see after sending a join request
  const [pendingMatches, setPendingMatches] = useState([
    {
      id: 3,
      title: 'Saturday Competitive League',
      venue: 'Greenwood Park',
      dateLabel: 'Sat, Jun 6',
      time: '4:00 PM',
      skillLevel: 'Advanced',
      status: 'pending',
    },
  ])

  // Dummy data for completed matches
  const completedMatches = [
    {
      id: 10,
      title: 'Friday Futsal Night',
      venue: 'Harbourfront Centre',
      dateLabel: 'Fri, May 23',
      time: '8:00 PM',
      skillLevel: 'Intermediate',
      status: 'completed',
      attended: true,
    },
    {
      id: 11,
      title: 'Tuesday Warmup',
      venue: 'Dufferin Grove Park',
      dateLabel: 'Tue, May 20',
      time: '5:30 PM',
      skillLevel: 'Beginner',
      status: 'completed',
      attended: false,
    },
  ]

  // Cancel a pending request
  function handleCancelRequest(matchId) {
    setPendingMatches(pendingMatches.filter(function(m) {
      return m.id !== matchId
    }))
  }

  // Skill badge class
  function getSkillClass(level) {
    if (level === 'Beginner') return 'skill-badge skill-beginner'
    if (level === 'Intermediate') return 'skill-badge skill-intermediate'
    return 'skill-badge skill-advanced'
  }

  return (
    <div className="my-matches-page">

      <Navbar role={role} setRole={setRole} />

      <div className="my-matches-content">

        <h1 className="my-matches-heading">My Matches</h1>
        <p className="my-matches-subheading">Track all your upcoming and past games</p>

        {/* Tab bar */}
        <div className="tab-bar">
          <button
            className={activeTab === 'upcoming' ? 'tab-btn active' : 'tab-btn'}
            onClick={function() { setActiveTab('upcoming') }}
          >
            Upcoming
            <span className="tab-count">{upcomingMatches.length}</span>
          </button>

          <button
            className={activeTab === 'pending' ? 'tab-btn active' : 'tab-btn'}
            onClick={function() { setActiveTab('pending') }}
          >
            Pending
            <span className="tab-count">{pendingMatches.length}</span>
          </button>

          <button
            className={activeTab === 'completed' ? 'tab-btn active' : 'tab-btn'}
            onClick={function() { setActiveTab('completed') }}
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
                onBtnClick={function() { navigate('/') }}
              />
            ) : (
              upcomingMatches.map(function(match) {
                return (
                  <div key={match.id} className="match-row-card">

                    <div className="match-row-info">
                      <h3 className="match-row-title">{match.title}</h3>
                      <p className="match-row-venue">{match.venue}</p>
                      <div className="match-row-meta">
                        <span>
                          <IconCalendar size={12} color="#9CA3AF" />
                          {match.dateLabel}
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
                      <span className="status-badge status-confirmed">✓ Confirmed</span>
                      <button
                        className="btn-view-match"
                        onClick={function() { navigate('/match/' + match.id) }}
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
                onBtnClick={function() { navigate('/') }}
              />
            ) : (
              pendingMatches.map(function(match) {
                return (
                  <div key={match.id} className="match-row-card">

                    <div className="match-row-info">
                      <h3 className="match-row-title">{match.title}</h3>
                      <p className="match-row-venue">{match.venue}</p>
                      <div className="match-row-meta">
                        <span>
                          <IconCalendar size={12} color="#9CA3AF" />
                          {match.dateLabel}
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
                      <span className="status-badge status-pending">⏳ Pending Approval</span>
                      <button
                        className="btn-cancel-req"
                        onClick={function() { handleCancelRequest(match.id) }}
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
              completedMatches.map(function(match) {
                return (
                  <div key={match.id} className="match-row-card">

                    <div className="match-row-info">
                      <h3 className="match-row-title">{match.title}</h3>
                      <p className="match-row-venue">{match.venue}</p>
                      <div className="match-row-meta">
                        <span>
                          <IconCalendar size={12} color="#9CA3AF" />
                          {match.dateLabel}
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
                      {match.attended
                        ? <span className="status-badge status-attended">✓ Attended</span>
                        : <span className="status-badge status-absent">✗ Absent</span>
                      }
                    </div>

                  </div>
                )
              })
            )}
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