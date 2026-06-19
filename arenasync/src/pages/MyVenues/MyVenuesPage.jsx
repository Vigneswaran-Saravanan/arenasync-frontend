import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './MyVenuesPage.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import IconLocation from '../../components/icons/IconLocation'

function MyVenuesPage({ role, setRole }) {

  const navigate = useNavigate()

  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(function () {
    async function fetchMyVenues() {
      try {
        const token = localStorage.getItem('token')

        const res = await axios.get('http://localhost:5000/api/venues/my-venues', {
          headers: { Authorization: 'Bearer ' + token }
        })
        setVenues(res.data.venues)

      } catch (err) {
        setError('Could not load your venues.')
      } finally {
        setLoading(false)
      }
    }
    fetchMyVenues()
  }, [])

  if (loading) {
    return (
      <div className="my-venues-page">
        <Navbar role={role} setRole={setRole} />
        <div style={{ padding: 60, textAlign: 'center', color: '#6B7280' }}>Loading your venues...</div>
      </div>
    )
  }

  return (
    <div className="my-venues-page">

      <Navbar role={role} setRole={setRole} />

      <div className="my-venues-content">

        <h1 className="my-venues-heading">My Venues</h1>
        <p className="my-venues-subheading">Manage the venues you have listed</p>

        {error && (
          <p style={{ color: '#DC2626', marginBottom: 16 }}>{error}</p>
        )}

        <button
          className="btn-create-venue"
          style={{ marginBottom: 24 }}
          onClick={function () { navigate('/create-venue') }}
        >
          + Create Venue
        </button>

        {venues.length === 0 ? (
          <div className="venue-empty">
            <div className="venue-empty-icon">
              <IconLocation size={24} color="#9CA3AF" />
            </div>
            <h3>No venues yet</h3>
            <p>Create your first venue listing to get started</p>
          </div>
        ) : (
          venues.map(function (venue) {
            return (
              <div key={venue._id} className="venue-row-card">

                <div className="venue-row-info">
                  <h3 className="venue-row-title">{venue.name}</h3>
                  <p className="venue-row-address">{venue.address}</p>
                  <div className="venue-row-meta">
                    <span>{venue.fieldType}</span>
                    <span>{venue.capacity} players</span>
                  </div>
                </div>

                <div className="venue-row-actions">
                  <button
                    className="btn-manage-venue"
                    onClick={function () { navigate('/venue/' + venue._id) }}
                  >
                    Manage
                  </button>
                </div>

              </div>
            )
          })
        )}

      </div>

      <Footer />

    </div>
  )
}

export default MyVenuesPage