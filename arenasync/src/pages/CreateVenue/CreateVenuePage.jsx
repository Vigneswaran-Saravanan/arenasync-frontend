import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './CreateVenuePage.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function CreateVenuePage({ role, setRole }) {

  const navigate = useNavigate()

  const allFacilities = [
    'Floodlights',
    'Parking',
    'Changing Rooms',
    'Water Fountains',
    'First Aid',
    'Spectator Seating',
  ]

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [fieldType, setFieldType] = useState('')
  const [capacity, setCapacity] = useState(14)
  const [facilities, setFacilities] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [createdVenue, setCreatedVenue] = useState(null)

  function toggleFacility(facility) {
    if (facilities.includes(facility)) {
      setFacilities(facilities.filter(function (f) { return f !== facility }))
    } else {
      setFacilities([...facilities, facility])
    }
  }

  function validate() {
    const newErrors = {}
    if (!name.trim()) newErrors.name = 'Venue name is required'
    if (!address.trim()) newErrors.address = 'Address is required'
    if (!capacity || capacity < 2) newErrors.capacity = 'Capacity must be at least 2'
    return newErrors
  }

  async function handleSubmit() {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      const response = await axios.post(
        API_URL + '/api/venues',
        {
          name,
          address,
          fieldType,
          capacity,
          facilities
        },
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      )

      // Venue created successfully
      setSubmitted(true)
      setCreatedVenue(response.data.venue)

    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrors({ server: error.response.data.message })
      } else {
        setErrors({ server: 'Something went wrong. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  if (submitted && createdVenue) {
    return (
      <div className="create-venue-success">
        <Navbar role={role} setRole={setRole} />
        <div className="create-venue-success-box">
          <div className="venue-success-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#16A34A" />
              <polyline
                points="6 12 10 16 18 8"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>Venue Created!</h2>
          <p><strong>{createdVenue.name}</strong> has been listed.</p>
          <p>{createdVenue.address}</p>
          <p style={{ marginTop: 8, fontSize: 13, color: '#16A34A', fontWeight: 600 }}>
            Field Type: {createdVenue.fieldType || 'Not specified'} · Capacity: {createdVenue.capacity}
          </p>
          <div className="venue-success-buttons">
            <button
              className="btn-venue-success-back"
              onClick={function () { navigate('/my-venues') }}
            >
              Back to My Venues
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="create-venue-page">

      <Navbar role={role} setRole={setRole} />

      <div className="create-venue-content">

        <h1 className="create-venue-heading">Create a Venue</h1>
        <p className="create-venue-subheading">List your field for organizers to find</p>

        {errors.server && (
          <div className="venue-server-error">{errors.server}</div>
        )}

        <div className="venue-form-group">
          <label className="venue-form-label">Venue Name <span style={{ color: '#DC2626' }}>*</span></label>
          <input
            type="text"
            className={errors.name ? 'venue-form-input error' : 'venue-form-input'}
            placeholder="e.g. Downtown Soccer Field"
            value={name}
            onChange={function (e) { setName(e.target.value) }}
          />
          {errors.name && <p className="venue-form-error">{errors.name}</p>}
        </div>

        <div className="venue-form-group">
          <label className="venue-form-label">Address <span style={{ color: '#DC2626' }}>*</span></label>
          <input
            type="text"
            className={errors.address ? 'venue-form-input error' : 'venue-form-input'}
            placeholder="Street address, city, province"
            value={address}
            onChange={function (e) { setAddress(e.target.value) }}
          />
          {errors.address && <p className="venue-form-error">{errors.address}</p>}
        </div>

        <div className="venue-form-row">
          <div className="venue-form-group">
            <label className="venue-form-label">Field Type</label>
            <input
              type="text"
              className="venue-form-input"
              placeholder="e.g. Artificial Turf"
              value={fieldType}
              onChange={function (e) { setFieldType(e.target.value) }}
            />
          </div>

          <div className="venue-form-group">
            <label className="venue-form-label">Capacity (players) <span style={{ color: '#DC2626' }}>*</span></label>
            <input
              type="number"
              className={errors.capacity ? 'venue-form-input error' : 'venue-form-input'}
              min="2"
              max="30"
              value={capacity}
              onChange={function (e) { setCapacity(e.target.value) }}
            />
            {errors.capacity && <p className="venue-form-error">{errors.capacity}</p>}
          </div>
        </div>

        <div className="venue-form-group">
          <label className="venue-form-label">Facilities</label>
          <div className="venue-facilities-grid">
            {allFacilities.map(function (facility) {
              return (
                <label key={facility} className="venue-facility-checkbox">
                  <input
                    type="checkbox"
                    checked={facilities.includes(facility)}
                    onChange={function () { toggleFacility(facility) }}
                  />
                  {facility}
                </label>
              )
            })}
          </div>
        </div>

        <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 8, textAlign: 'right' }}>
          <span style={{ color: '#DC2626' }}>*</span> Required field
        </p>

        <button
          className="btn-submit-venue"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Creating Venue...' : 'Create Venue'}
        </button>

      </div>

      <Footer />

    </div>
  )
}

export default CreateVenuePage