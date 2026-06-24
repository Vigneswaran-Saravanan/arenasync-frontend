import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './VenueDetailPage.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function VenueDetailPage({ role, setRole }) {

  const { id } = useParams()
  const navigate = useNavigate()

  const [venue, setVenue] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(function () {
    fetchVenue()
  }, [id])

  async function fetchVenue() {
    try {
      const res = await axios.get(API_URL + '/api/venues/' + id)
      setVenue(res.data.venue)
      setBookings(res.data.bookings || [])
    } catch (err) {
      setError('Venue not found.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(API_URL + '/api/venues/' + id, {
        headers: { Authorization: 'Bearer ' + token }
      })
      navigate('/my-venues')
    } catch (err) {
      setShowDeleteModal(false)
      alert(err.response?.data?.message || 'Could not delete venue.')
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'TBD'
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  // Works out where the back button and error screen should go, based on role
  function getBackPath() {
    return role === 'Venue Host' ? '/my-venues' : '/browse-venues'
  }

  function getBackLabel() {
    return role === 'Venue Host' ? '← Back to My Venues' : '← Back to Browse Venues'
  }

  if (loading) {
    return (
      <div className="venue-detail-page">
        <Navbar role={role} setRole={setRole} />
        <div style={{ padding: 60, textAlign: 'center', color: '#6B7280' }}>Loading venue...</div>
      </div>
    )
  }

  if (error || !venue) {
    return (
      <div className="venue-detail-page">
        <Navbar role={role} setRole={setRole} />
        <div style={{ padding: 60, textAlign: 'center' }}>
          <h2>{error || 'Venue not found'}</h2>
          <button
            onClick={function () { navigate(getBackPath()) }}
            style={{ marginTop: 16, padding: '10px 24px', background: '#16A34A', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
          >
            {getBackLabel()}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="venue-detail-page">

      <Navbar role={role} setRole={setRole} />

      <div className="venue-detail-content">

        <button className="venue-detail-back-btn" onClick={function () { navigate(getBackPath()) }}>
          {getBackLabel()}
        </button>

        {/* Header card */}
        <div className="venue-detail-header-card">
          <div>
            <h1 className="venue-detail-name">{venue.name}</h1>
            <div className="venue-detail-address-row">
              <p className="venue-detail-address">{venue.address}</p>

              <a href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(venue.address || '')}
                target="_blank"
                rel="noreferrer"
                className="venue-detail-directions-link"
              >
                Get Directions
              </a>
            </div>

            <div className="venue-detail-meta-row">
              <span className="venue-detail-chip">{venue.fieldType || 'Not specified'}</span>
              <span className="venue-detail-chip">{venue.capacity} players</span>
            </div>

            {venue.facilities && venue.facilities.length > 0 && (
              <div className="venue-detail-facilities">
                {venue.facilities.map(function (f) {
                  return <span key={f} className="venue-detail-facility-tag">{f}</span>
                })}
              </div>
            )}
          </div>

          {role === 'Venue Host' && (
            <div className="venue-detail-actions">
              <button
                className="btn-edit-venue-detail"
                onClick={function () { navigate('/edit-venue/' + venue._id) }}
              >
                Edit Venue
              </button>
              <button
                className="btn-delete-venue-detail"
                onClick={function () { setShowDeleteModal(true) }}
              >
                Delete
              </button>
            </div>
          )}

          {role === 'Organizer' && (
            <div className="venue-detail-actions">
              <button
                className="btn-edit-venue-detail"
                onClick={function () {
                  navigate('/create-match', {
                    state: {
                      selectedVenue: {
                        venueId: venue._id,
                        name: venue.name,
                        address: venue.address
                      }
                    }
                  })
                }}
              >
                Use This Venue
              </button>
            </div>
          )}
        </div>

        {/* Bookings — only visible to the venue host who owns this venue */}
        {role === 'Venue Host' && (
          <div className="venue-bookings-card">
            <div className="venue-bookings-header">
              <h3>Upcoming Bookings</h3>
              <span>{bookings.length} bookings</span>
            </div>

            {bookings.length === 0 ? (
              <div className="venue-no-bookings">No upcoming bookings</div>
            ) : (
              <table className="venue-bookings-table">
                <thead>
                  <tr>
                    <th>Match</th>
                    <th>Organizer</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(function (booking) {
                    return (
                      <tr key={booking._id}>
                        <td className="venue-booking-match-name">{booking.title}</td>
                        <td>{booking.organizer?.name || 'Unknown'}</td>
                        <td>{formatDate(booking.date)}</td>
                        <td>{booking.time}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>

      <Footer />

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="venue-modal-overlay">
          <div className="venue-modal-box">
            <h3>Delete this venue?</h3>
            <p>
              This will permanently remove "{venue.name}" from your listings. This cannot be undone.
            </p>
            <div className="venue-modal-buttons">
              <button
                className="btn-venue-modal-keep"
                onClick={function () { setShowDeleteModal(false) }}
              >
                Keep Venue
              </button>
              <button
                className="btn-venue-modal-delete"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default VenueDetailPage