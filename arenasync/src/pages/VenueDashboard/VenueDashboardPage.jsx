import { useState } from 'react'
import './VenueDashboardPage.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import venue from '../../data/venue'

function VenueDashboardPage({ role, setRole }) {

  // All available facilities to choose from
  const allFacilities = [
    'Floodlights',
    'Parking',
    'Changing Rooms',
    'Water Fountains',
    'First Aid',
    'Spectator Seating',
  ]

  // Venue data state — starts from dummy data file
  // capacity is 10 so user can fix it to 20 during testing
  const [venueName, setVenueName] = useState(venue.name)
  const [venueAddress, setVenueAddress] = useState(venue.address)
  const [fieldType, setFieldType] = useState(venue.fieldType)
  const [capacity, setCapacity] = useState(venue.capacity)
  const [facilities, setFacilities] = useState(venue.facilities)

  // Edit mode — when true the form shows
  const [editMode, setEditMode] = useState(false)

  // Temp values used while editing
  // These only get saved when user clicks Save
  const [tempName, setTempName] = useState(venueName)
  const [tempAddress, setTempAddress] = useState(venueAddress)
  const [tempFieldType, setTempFieldType] = useState(fieldType)
  const [tempCapacity, setTempCapacity] = useState(capacity)
  const [tempFacilities, setTempFacilities] = useState(facilities)

  // Show success banner after saving
  const [showSuccess, setShowSuccess] = useState(false)

  // Open edit form
  // Copy current values into temp values
  function handleEditClick() {
    setTempName(venueName)
    setTempAddress(venueAddress)
    setTempFieldType(fieldType)
    setTempCapacity(capacity)
    setTempFacilities([...facilities])
    setEditMode(true)
    setShowSuccess(false)
  }

  // Cancel editing — discard changes
  function handleCancelEdit() {
    setEditMode(false)
  }

  // Save changes — copy temp values into real values
  function handleSave() {
    setVenueName(tempName)
    setVenueAddress(tempAddress)
    setFieldType(tempFieldType)
    setCapacity(parseInt(tempCapacity))
    setFacilities(tempFacilities)
    setEditMode(false)
    setShowSuccess(true)
    // Hide success banner after 4 seconds
    setTimeout(function() { setShowSuccess(false) }, 4000)
  }

  // Toggle a facility checkbox
  function toggleFacility(facility) {
    if (tempFacilities.includes(facility)) {
      // Remove it
      setTempFacilities(tempFacilities.filter(function(f) {
        return f !== facility
      }))
    } else {
      // Add it
      setTempFacilities([...tempFacilities, facility])
    }
  }

  return (
    <div className="venue-dashboard-page">

      <Navbar role={role} setRole={setRole} />

      <div className="venue-dashboard-content">

        <h1 className="venue-dashboard-heading">My Venue</h1>
        <p className="venue-dashboard-subheading">
          Manage your field listing and upcoming bookings
        </p>

        {/* Success banner — shows after saving */}
        {showSuccess && (
          <div className="save-success-banner">
            ✓ Venue updated successfully!
          </div>
        )}

        {/* Venue Info Card */}
        <div className="venue-info-card">

          {/* Photo placeholder */}
          <div className="venue-photo-placeholder">🏟️</div>

          {/* Venue details */}
          <div className="venue-info-main">
            <h2 className="venue-info-name">{venueName}</h2>
            <p className="venue-info-address">{venueAddress}</p>
            <p className="venue-info-meta">
              <strong>Field Type:</strong> {fieldType} &nbsp;·&nbsp;
              <strong>Capacity:</strong> {capacity} players
            </p>
            <div className="venue-facilities">
              {facilities.map(function(f) {
                return (
                  <span key={f} className="facility-tag">{f}</span>
                )
              })}
            </div>
          </div>

          {/* Edit button */}
          {!editMode && (
            <button className="btn-edit-venue" onClick={handleEditClick}>
              Edit Venue
            </button>
          )}

        </div>

        {/* Edit Form — only shows when editMode is true */}
        {editMode && (
          <div className="venue-edit-card">

            <h3>Edit Venue Details</h3>

            <div className="edit-form-grid">

              <div className="edit-form-group">
                <label>Venue Name</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={function(e) { setTempName(e.target.value) }}
                />
              </div>

              <div className="edit-form-group">
                <label>Field Type</label>
                <input
                  type="text"
                  value={tempFieldType}
                  onChange={function(e) { setTempFieldType(e.target.value) }}
                />
              </div>

              <div className="edit-form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={tempAddress}
                  onChange={function(e) { setTempAddress(e.target.value) }}
                />
              </div>

              {/* Capacity field — this is what the user needs to fix */}
              <div className="edit-form-group">
                <label>Capacity (players)</label>
                <input
                  type="number"
                  value={tempCapacity}
                  onChange={function(e) { setTempCapacity(e.target.value) }}
                  min="2"
                  max="100"
                />
              </div>

            </div>

            {/* Facilities checkboxes */}
            <p className="facilities-label">Facilities</p>
            <div className="facilities-grid">
              {allFacilities.map(function(facility) {
                return (
                  <label key={facility} className="facility-checkbox">
                    <input
                      type="checkbox"
                      checked={tempFacilities.includes(facility)}
                      onChange={function() { toggleFacility(facility) }}
                    />
                    {facility}
                  </label>
                )
              })}
            </div>

            <div className="edit-form-actions">
              <button className="btn-save-venue" onClick={handleSave}>
                Save Changes
              </button>
              <button className="btn-cancel-edit" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>

          </div>
        )}

        {/* Upcoming Bookings */}
        <div className="bookings-card">

          <div className="bookings-card-header">
            <h3>Upcoming Bookings</h3>
            <span>{venue.bookings.length} bookings</span>
          </div>

          {venue.bookings.length === 0 ? (
            <div className="no-bookings">No upcoming bookings</div>
          ) : (
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Match</th>
                  <th>Organizer</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Players</th>
                </tr>
              </thead>
              <tbody>
                {venue.bookings.map(function(booking) {
                  return (
                    <tr key={booking.id}>
                      <td className="booking-match-name">{booking.match}</td>
                      <td>{booking.organizer}</td>
                      <td>{booking.date}</td>
                      <td>{booking.time}</td>
                      <td>
                        <span className="booking-players-badge">
                          {booking.players} players
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}

        </div>

      </div>

      <Footer />

    </div>
  )
}

export default VenueDashboardPage