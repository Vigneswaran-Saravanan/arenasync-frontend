import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateMatchPage.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import IconLocation from '../../components/icons/IconLocation'

function CreateMatchPage({ role, setRole }) {

  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [venue, setVenue] = useState('')
  const [address, setAddress] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [maxPlayers, setMaxPlayers] = useState(10)
  const [skillLevel, setSkillLevel] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function validate() {
    const newErrors = {}
    if (!title.trim()) newErrors.title = 'Match title is required'
    if (!venue.trim()) newErrors.venue = 'Venue name is required'
    if (!date) newErrors.date = 'Date is required'
    if (!time) newErrors.time = 'Time is required'
    if (!skillLevel) newErrors.skillLevel = 'Please select a skill level'
    return newErrors
  }

  function handleSubmit() {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setSubmitted(true)
  }

  function increaseMax() {
    if (maxPlayers < 22) setMaxPlayers(maxPlayers + 1)
  }

  function decreaseMax() {
    if (maxPlayers > 2) setMaxPlayers(maxPlayers - 1)
  }

  if (submitted) {
    return (
      <div className="create-success">
        <Navbar role={role} setRole={setRole} />
        <div className="create-success-box">
          <div className="success-icon">🎉</div>
          <h2>Match Created!</h2>
          <p><strong>{title}</strong> has been listed.</p>
          <p>{venue} · {date} · {time}</p>
          <p style={{ marginTop: 8, fontSize: 13, color: '#16A34A', fontWeight: 600 }}>
            Skill Level: {skillLevel} · Max Players: {maxPlayers}
          </p>
          <div className="success-buttons">
            <button
              className="btn-success-home"
              onClick={function() { navigate('/') }}
            >
              Back to Home
            </button>
            <button
              className="btn-success-manage"
              onClick={function() { navigate('/organizer-match/1') }}
            >
              Manage Match
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="create-match-page">

      <Navbar role={role} setRole={setRole} />

      <div className="create-match-layout">

        {/* Left panel — form */}
        <div className="create-match-form-panel">

          <h1 className="create-match-heading">Create a Match</h1>
          <p className="create-match-subheading">Fill in the details for your game</p>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Match Title</label>
            <input
              type="text"
              className={errors.title ? 'form-input error' : 'form-input'}
              placeholder="e.g. Friday Evening 5-a-side"
              value={title}
              onChange={function(e) { setTitle(e.target.value) }}
            />
            {errors.title && <p className="form-error">{errors.title}</p>}
          </div>

          {/* Venue */}
          <div className="form-group">
            <label className="form-label">Venue Name</label>
            <input
              type="text"
              className={errors.venue ? 'form-input error' : 'form-input'}
              placeholder="e.g. Christie Pits Park"
              value={venue}
              onChange={function(e) { setVenue(e.target.value) }}
            />
            {errors.venue && <p className="form-error">{errors.venue}</p>}
          </div>

          {/* Address */}
          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-input"
              placeholder="Street address, Toronto"
              value={address}
              onChange={function(e) { setAddress(e.target.value) }}
            />
          </div>

          {/* Date and Time */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className={errors.date ? 'form-input error' : 'form-input'}
                value={date}
                onChange={function(e) { setDate(e.target.value) }}
              />
              {errors.date && <p className="form-error">{errors.date}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input
                type="time"
                className={errors.time ? 'form-input error' : 'form-input'}
                value={time}
                onChange={function(e) { setTime(e.target.value) }}
              />
              {errors.time && <p className="form-error">{errors.time}</p>}
            </div>
          </div>

          {/* Max Players */}
          <div className="form-group">
            <label className="form-label">Max Players</label>
            <div className="number-stepper">
              <button className="stepper-btn" onClick={decreaseMax}>−</button>
              <span className="stepper-value">{maxPlayers}</span>
              <button className="stepper-btn" onClick={increaseMax}>+</button>
            </div>
          </div>

          {/* Skill Level */}
          <div className="form-group">
            <label className="form-label">Skill Level</label>
            <div className="skill-pills">
              {['Beginner', 'Intermediate', 'Advanced'].map(function(level) {
                return (
                  <button
                    key={level}
                    className={skillLevel === level ? 'skill-pill active' : 'skill-pill'}
                    onClick={function() { setSkillLevel(level) }}
                  >
                    {level}
                  </button>
                )
              })}
            </div>
            {errors.skillLevel && <p className="form-error">{errors.skillLevel}</p>}
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <textarea
              className="form-input"
              placeholder="Field type, what to bring, any rules..."
              rows={3}
              value={notes}
              onChange={function(e) { setNotes(e.target.value) }}
              style={{ resize: 'vertical' }}
            />
          </div>

          <button className="btn-create-match" onClick={handleSubmit}>
            Create Match →
          </button>

        </div>

        {/* Right panel — map */}
        <div className="create-match-map-panel">

          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.25 }}>
            {[0,1,2,3,4,5,6,7,8,9].map(function(i) {
              return <line key={'h'+i} x1="0" y1={i*10+'%'} x2="100%" y2={i*10+'%'} stroke="#86efac" strokeWidth="1" />
            })}
            {[0,1,2,3,4,5,6,7,8,9].map(function(i) {
              return <line key={'v'+i} x1={i*10+'%'} y1="0" x2={i*10+'%'} y2="100%" stroke="#86efac" strokeWidth="1" />
            })}
          </svg>

          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.15 }}>
            <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#4ade80" strokeWidth="6" />
            <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#4ade80" strokeWidth="6" />
          </svg>

          <div className="map-hint">
            Pin will update as you type your venue
          </div>

          {venue && (
            <div style={{ position: 'absolute', top: '45%', left: '48%', transform: 'translate(-50%, -100%)' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#16A34A', border: '3px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconLocation size={18} color="white" />
              </div>
              <div style={{ position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)', background: 'white', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', color: '#111827' }}>
                {venue}
              </div>
            </div>
          )}

          <div style={{ position: 'absolute', bottom: 16, left: 16, background: 'rgba(255,255,255,0.9)', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 4 }}>
            <IconLocation size={12} color="#16A34A" />
            Toronto, ON
          </div>

        </div>

      </div>

    </div>
  )
}

export default CreateMatchPage