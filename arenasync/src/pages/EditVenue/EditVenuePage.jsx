import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import './EditVenuePage.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function EditVenuePage({ role, setRole }) {

  const navigate = useNavigate()
  const { id } = useParams()

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
  const [fetching, setFetching] = useState(true)

  // Load existing venue data when page opens
  useEffect(function () {
    async function fetchVenue() {
      try {
        const res = await axios.get(API_URL + '/api/venues/' + id)
        const venue = res.data.venue

        setName(venue.name || '')
        setAddress(venue.address || '')
        setFieldType(venue.fieldType || '')
        setCapacity(venue.capacity || 14)
        setFacilities(venue.facilities || [])

      } catch (err) {
        setErrors({ server: 'Could not load venue details.' })
      } finally {
        setFetching(false)
      }
    }
    fetchVenue()
  }, [id])

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

      await axios.put(
        API_URL + '/api/venues/' + id,
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

      // Go back to the venue detail page after saving
      navigate('/venue/' + id)

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

  if (fetching) {
    return (
      <div className="edit-venue-page">
        <Navbar role={role} setRole={setRole} />
        <div style={{ padding: 60, textAlign: 'center', color: '#6B7280' }}>Loading venue details...</div>
      </div>
    )
  }

  return (
    <div className="edit-venue-page">

      <Navbar role={role} setRole={setRole} />

      <div className="edit-venue-content">

        <h1 className="edit-venue-heading">Edit Venue</h1>
        <p className="edit-venue-subheading">Update your venue listing details</p>

        {errors.server && (
          <div className="venue-server-error">{errors.server}</div>
        )}

        <div className="venue-form-group">
          <label className="venue-form-label">Venue Name</label>
          <input
            type="text"
            className={errors.name ? 'venue-form-input error' : 'venue-form-input'}
            value={name}
            onChange={function (e) { setName(e.target.value) }}
          />
          {errors.name && <p className="venue-form-error">{errors.name}</p>}
        </div>

        <div className="venue-form-group">
          <label className="venue-form-label">Address</label>
          <input
            type="text"
            className={errors.address ? 'venue-form-input error' : 'venue-form-input'}
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
              value={fieldType}
              onChange={function (e) { setFieldType(e.target.value) }}
            />
          </div>

          <div className="venue-form-group">
            <label className="venue-form-label">Capacity (players)</label>
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

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            className="btn-save-venue-edit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
          <button
            className="btn-cancel-venue-edit"
            onClick={function () { navigate('/venue/' + id) }}
          >
            Cancel
          </button>
        </div>

      </div>

      <Footer />

    </div>
  )
}

export default EditVenuePage