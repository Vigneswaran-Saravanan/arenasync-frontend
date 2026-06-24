import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

function LandingPage({ role }) {

  const navigate = useNavigate()

  // If already logged in, redirect to the right page
  useEffect(function () {
    if (role === 'Organizer') navigate('/my-matches')
    else if (role === 'Venue Host') navigate('/my-venues')
    else if (role === 'Admin') navigate('/admin')
    else if (role === 'Player') navigate('/home')
  }, [role])

  return (
    <div className="landing-page">

      <Navbar role={null} />

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <div className="landing-hero-tag">Local Soccer — Simplified</div>
          <h1 className="landing-hero-heading">
            Find your game.<br />Own the pitch.
          </h1>
          <p className="landing-hero-sub">
            ArenaSync connects local soccer players, organizers and venues in one place.
            No more WhatsApp groups, no more missed messages — just show up and play.
          </p>
          <div className="landing-hero-buttons">
            <button
              className="btn-landing-primary"
              onClick={function () { navigate('/register') }}
            >
              Get Started — It's Free
            </button>
            <button
              className="btn-landing-secondary"
              onClick={function () { navigate('/login') }}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <h2 className="landing-section-heading">How ArenaSync Works</h2>
          <p className="landing-section-sub">
            Three simple steps to get on the pitch
          </p>
          <div className="landing-steps">
            <div className="landing-step">
              <div className="landing-step-number">1</div>
              <h3>Create an Account</h3>
              <p>Sign up as a Player, Organizer or Venue Host. Each role gets its own set of tools built for what you actually need to do.</p>
            </div>
            <div className="landing-step">
              <div className="landing-step-number">2</div>
              <h3>Find or Create a Match</h3>
              <p>Players browse upcoming matches by skill level and location. Organizers create matches, set the rules and confirm who gets a spot.</p>
            </div>
            <div className="landing-step">
              <div className="landing-step-number">3</div>
              <h3>Show Up and Play</h3>
              <p>Get confirmed, receive notifications and head to the pitch. After the game, attendance is recorded and your profile stays up to date.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Role cards */}
      <section className="landing-section landing-section-grey">
        <div className="landing-section-inner">
          <h2 className="landing-section-heading">Who is ArenaSync for?</h2>
          <p className="landing-section-sub">
            Built for everyone in your local soccer community
          </p>
          <div className="landing-roles">

            <div className="landing-role-card">
              <div className="landing-role-icon landing-role-icon-player">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Players</h3>
              <p>Browse open matches near you, filter by skill level, send a join request and wait for confirmation. Track your upcoming games and attendance history all in one place.</p>
              <button
                className="btn-role-card"
                onClick={function () { navigate('/register') }}
              >
                Join as Player
              </button>
            </div>

            <div className="landing-role-card">
              <div className="landing-role-icon landing-role-icon-organizer">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="white" strokeWidth="2" />
                  <line x1="3" y1="9" x2="21" y2="9" stroke="white" strokeWidth="2" />
                  <line x1="8" y1="2" x2="8" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="16" y1="2" x2="16" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Organizers</h3>
              <p>Create matches, set the venue, date, time and skill level. Review join requests, accept the right players and manage your roster. Mark attendance after the game.</p>
              <button
                className="btn-role-card"
                onClick={function () { navigate('/register') }}
              >
                Join as Organizer
              </button>
            </div>

            <div className="landing-role-card">
              <div className="landing-role-icon landing-role-icon-host">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M3 10.5L12 3L21 10.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                  <rect x="9" y="13" width="6" height="8" stroke="white" strokeWidth="2" />
                </svg>
              </div>
              <h3>Venue Hosts</h3>
              <p>List your field, set capacity and facilities. See all upcoming matches booked at your venue so you can prepare your pitch and avoid scheduling conflicts.</p>
              <button
                className="btn-role-card"
                onClick={function () { navigate('/register') }}
              >
                List Your Venue
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <h2 className="landing-section-heading">Everything you need in one place</h2>
          <div className="landing-features">
            <div className="landing-feature">
              <div className="landing-feature-dot" />
              <div>
                <h4>Join Request System</h4>
                <p>Players request to join. Organizers review and confirm. No overbooking, no confusion.</p>
              </div>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-dot" />
              <div>
                <h4>Real-Time Notifications</h4>
                <p>Get notified when your request is accepted, declined or when a match is cancelled.</p>
              </div>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-dot" />
              <div>
                <h4>Attendance Tracking</h4>
                <p>Organizers mark who showed up after each match. Your attendance rate is visible on your profile.</p>
              </div>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-dot" />
              <div>
                <h4>Venue Directory</h4>
                <p>Browse registered venues, see facilities and get directions with one click.</p>
              </div>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-dot" />
              <div>
                <h4>Skill Level Matching</h4>
                <p>Matches are tagged Beginner, Intermediate or Advanced so you always find the right game.</p>
              </div>
            </div>
            <div className="landing-feature">
              <div className="landing-feature-dot" />
              <div>
                <h4>Match History</h4>
                <p>See all your upcoming, pending and completed matches from your personal dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="landing-cta-inner">
          <h2>Ready to find your next game?</h2>
          <p>Join ArenaSync today — it's completely free.</p>
          <button
            className="btn-landing-primary"
            onClick={function () { navigate('/register') }}
          >
            Create Your Free Account
          </button>
        </div>
      </section>

      <Footer />

    </div>
  )
}

export default LandingPage