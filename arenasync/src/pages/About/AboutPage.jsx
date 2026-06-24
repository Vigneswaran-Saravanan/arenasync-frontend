import { useNavigate } from 'react-router-dom'
import './AboutPage.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

function AboutPage() {

  const navigate = useNavigate()

  return (
    <div className="about-page">

      <Navbar role={null} />

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-inner">
          <h1 className="about-hero-heading">About ArenaSync</h1>
          <p className="about-hero-sub">
            ArenaSync was built to solve a simple problem — organizing a local soccer match
            should not require a dozen WhatsApp messages and a spreadsheet.
            We built one platform where players, organizers and venues can all work together.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="about-section">
        <div className="about-section-inner">
          <div className="about-two-col">
            <div>
              <h2>Why ArenaSync exists</h2>
              <p>
                Most informal soccer games in local communities are coordinated through
                group chats, word of mouth or social media posts. This leads to missed
                confirmations, no-shows, overbooking and no way to track whether players
                are reliable.
              </p>
              <p>
                ArenaSync gives every person involved in a local match — the player
                looking for a game, the organizer running the team and the venue host
                managing the field — a structured and reliable system to work from.
              </p>
            </div>
            <div className="about-stat-box">
              <div className="about-stat">
                <span className="about-stat-number">4</span>
                <span className="about-stat-label">User Roles</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-number">100%</span>
                <span className="about-stat-label">Free to Use</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-number">1</span>
                <span className="about-stat-label">Platform for Everyone</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How each role works */}
      <section className="about-section about-section-grey">
        <div className="about-section-inner">
          <h2 className="about-roles-heading">How each role works</h2>
          <p className="about-roles-sub">
            Every user type has a clear set of tools designed for what they actually need
          </p>

          {/* Player */}
          <div className="about-role-block">
            <div className="about-role-header">
              <div className="about-role-icon about-role-icon-player">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h3>Player</h3>
                <p>For individuals looking to join local soccer matches</p>
              </div>
            </div>
            <div className="about-role-steps">
              <div className="about-role-step">
                <span className="about-step-num">1</span>
                <div>
                  <strong>Register and set up your profile</strong>
                  <p>Sign up with your name, email and password. Choose Player as your role. Add your city, preferred position and skill level so organizers know who you are.</p>
                </div>
              </div>
              <div className="about-role-step">
                <span className="about-step-num">2</span>
                <div>
                  <strong>Browse matches on the home page</strong>
                  <p>The home page shows all upcoming open matches. Filter by skill level, date or location to find a game that suits you. Each match card shows the venue, date, time, skill level and spots remaining.</p>
                </div>
              </div>
              <div className="about-role-step">
                <span className="about-step-num">3</span>
                <div>
                  <strong>Send a join request</strong>
                  <p>Click View on any match card to see the full details. If you want to play, click Request to Join. Your request goes to the organizer for review. The button changes to show your request is pending.</p>
                </div>
              </div>
              <div className="about-role-step">
                <span className="about-step-num">4</span>
                <div>
                  <strong>Wait for confirmation</strong>
                  <p>The organizer reviews your request. If they accept, you receive a notification and your spot is confirmed. If they decline, you receive a notification and can look for another match.</p>
                </div>
              </div>
              <div className="about-role-step">
                <span className="about-step-num">5</span>
                <div>
                  <strong>Track your matches</strong>
                  <p>Go to My Matches to see all your Upcoming, Pending and Completed games in one place. You can also leave a match if your plans change, which frees up the spot for another player.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Organizer */}
          <div className="about-role-block">
            <div className="about-role-header">
              <div className="about-role-icon about-role-icon-organizer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="white" strokeWidth="2" />
                  <line x1="3" y1="9" x2="21" y2="9" stroke="white" strokeWidth="2" />
                  <line x1="8" y1="2" x2="8" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="16" y1="2" x2="16" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h3>Organizer</h3>
                <p>For team managers and individuals who run local matches</p>
              </div>
            </div>
            <div className="about-role-steps">
              <div className="about-role-step">
                <span className="about-step-num">1</span>
                <div>
                  <strong>Register as an Organizer</strong>
                  <p>Sign up and choose Organizer as your role. You will have access to match creation tools, join request management and post-match controls that players do not see.</p>
                </div>
              </div>
              <div className="about-role-step">
                <span className="about-step-num">2</span>
                <div>
                  <strong>Create a match</strong>
                  <p>Click Create Match in the navbar. Fill in the match title, venue name, address, date, time, maximum number of players and skill level. Add any notes like field type or what players should bring. Submit and your match is live immediately.</p>
                </div>
              </div>
              <div className="about-role-step">
                <span className="about-step-num">3</span>
                <div>
                  <strong>Review join requests</strong>
                  <p>When a player requests to join, you receive a notification in the bell icon. Open the notification panel to see the player name and skill level. Accept or decline directly from the panel without leaving the page.</p>
                </div>
              </div>
              <div className="about-role-step">
                <span className="about-step-num">4</span>
                <div>
                  <strong>Manage your match</strong>
                  <p>Go to My Matches to see all your matches. Click Manage on any match to open the match management page. From here you can see the confirmed player grid, pending requests and declined players.</p>
                </div>
              </div>
              <div className="about-role-step">
                <span className="about-step-num">5</span>
                <div>
                  <strong>Mark as Completed and record attendance</strong>
                  <p>After the match ends, click Mark as Completed on the match management page. A Mark Attendance tab will appear. Tick the players who actually showed up and click Save Attendance. Each player's attendance rate on their profile is updated automatically.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Venue Host */}
          <div className="about-role-block">
            <div className="about-role-header">
              <div className="about-role-icon about-role-icon-host">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 10.5L12 3L21 10.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                  <rect x="9" y="13" width="6" height="8" stroke="white" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <h3>Venue Host</h3>
                <p>For field owners and facility managers who want to attract local teams</p>
              </div>
            </div>
            <div className="about-role-steps">
              <div className="about-role-step">
                <span className="about-step-num">1</span>
                <div>
                  <strong>Register as a Venue Host</strong>
                  <p>Sign up and choose Venue Host as your role. You will have access to venue listing and management tools.</p>
                </div>
              </div>
              <div className="about-role-step">
                <span className="about-step-num">2</span>
                <div>
                  <strong>Create your venue listing</strong>
                  <p>Go to Create Venue and fill in your field name, address, field type such as natural grass or artificial turf, player capacity and any available facilities like floodlights, parking or changing rooms.</p>
                </div>
              </div>
              <div className="about-role-step">
                <span className="about-step-num">3</span>
                <div>
                  <strong>Get discovered by organizers</strong>
                  <p>Organizers browsing venues will find your listing. They can view your address, facilities and capacity, and use your venue when creating a match. A Get Directions link is built in from your address.</p>
                </div>
              </div>
              <div className="about-role-step">
                <span className="about-step-num">4</span>
                <div>
                  <strong>Track upcoming bookings</strong>
                  <p>On your venue detail page, you can see all upcoming matches that have been booked at your field — including the match name, organizer, date, time and expected number of players. This helps you prepare the pitch and avoid scheduling conflicts.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-cta-inner">
          <h2>Ready to get started?</h2>
          <p>Create your free account and join your local soccer community today.</p>
          <div className="about-cta-buttons">
            <button
              className="btn-about-primary"
              onClick={function () { navigate('/register') }}
            >
              Create an Account
            </button>
            <button
              className="btn-about-secondary"
              onClick={function () { navigate('/contact') }}
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  )
}

export default AboutPage