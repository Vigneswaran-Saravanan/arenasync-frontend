import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './ProfilePage.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

function ProfilePage({ role, setRole }) {

    const navigate = useNavigate()

    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Edit mode state
    const [isEditing, setIsEditing] = useState(false)
    const [editCity, setEditCity] = useState('')
    const [editPosition, setEditPosition] = useState('')
    const [editSkillLevel, setEditSkillLevel] = useState('')
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState('')

    // Fetch profile on page load
    useEffect(function () {
        async function fetchProfile() {
            try {
                const token = localStorage.getItem('token')

                const res = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: { Authorization: 'Bearer ' + token }
                })
                setProfile(res.data)

            } catch (err) {
                setError('Could not load profile.')
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    // Open the edit form pre-filled with current values
    function handleEditClick() {
        setEditCity(profile.city || '')
        setEditPosition(profile.position || '')
        setEditSkillLevel(profile.skillLevel || '')
        setSaveError('')
        setIsEditing(true)
    }

    // Save the updated profile to the backend
    async function handleSave() {
        try {
            setSaving(true)
            const token = localStorage.getItem('token')

            const res = await axios.put(
                'http://localhost:5000/api/users/profile',
                {
                    city: editCity,
                    position: editPosition,
                    skillLevel: editSkillLevel
                },
                { headers: { Authorization: 'Bearer ' + token } }
            )

            setProfile(res.data)
            setIsEditing(false)

        } catch (err) {
            setSaveError('Could not save changes. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="profile-page">
                <Navbar role={role} setRole={setRole} />
                <div style={{ padding: 60, textAlign: 'center', color: '#6B7280' }}>Loading profile...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="profile-page">
                <Navbar role={role} setRole={setRole} />
                <div style={{ padding: 60, textAlign: 'center', color: '#DC2626' }}>{error}</div>
            </div>
        )
    }

    // Get first letter of name for avatar
    const avatarLetter = profile.name ? profile.name.charAt(0).toUpperCase() : 'U'

    return (
        <div className="profile-page">

            <Navbar role={role} setRole={setRole} />

            <div className="profile-content">

                {/* Profile header card */}
                <div className="profile-header-card">
                    <div className="profile-avatar">{avatarLetter}</div>

                    <div className="profile-info">
                        <h1 className="profile-name">{profile.name}</h1>
                        <p className="profile-email">{profile.email}</p>
                        <span className="profile-role-badge">{profile.role}</span>
                    </div>

                    <button className="btn-edit-profile" onClick={handleEditClick}>
                        Edit Profile
                    </button>
                </div>

                {/* Attendance rate — shown for Players only */}
                {profile.role === 'Player' && (
                    <div className="profile-stats-row">
                        <div className="profile-stat-card">
                            <div className="profile-stat-number">{profile.attendanceRate}%</div>
                            <div className="profile-stat-label">Attendance Rate</div>
                        </div>
                    </div>
                )}

                {/* Profile details card */}
                {!isEditing ? (
                    <div className="profile-details-card">
                        <h2 className="profile-section-title">Profile Details</h2>

                        <div className="profile-detail-row">
                            <span className="profile-detail-label">City</span>
                            <span className="profile-detail-value">
                                {profile.city ? profile.city : <span className="profile-not-set">Not set</span>}
                            </span>
                        </div>

                        {profile.role === 'Player' && (
                            <>
                                <div className="profile-detail-row">
                                    <span className="profile-detail-label">Position</span>
                                    <span className="profile-detail-value">
                                        {profile.position ? profile.position : <span className="profile-not-set">Not set</span>}
                                    </span>
                                </div>

                                <div className="profile-detail-row">
                                    <span className="profile-detail-label">Skill Level</span>
                                    <span className="profile-detail-value">
                                        {profile.skillLevel ? profile.skillLevel : <span className="profile-not-set">Not set</span>}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                ) : (

                    /* Edit form */
                    <div className="profile-details-card">
                        <h2 className="profile-section-title">Edit Profile</h2>

                        {saveError && (
                            <p style={{ color: '#DC2626', fontSize: 13, marginBottom: 12 }}>{saveError}</p>
                        )}

                        <div className="profile-edit-group">
                            <label className="profile-edit-label">City</label>
                            <input
                                type="text"
                                className="profile-edit-input"
                                placeholder="e.g. Toronto"
                                value={editCity}
                                onChange={function (e) { setEditCity(e.target.value) }}
                            />
                        </div>

                        {profile.role === 'Player' && (
                            <>
                                <div className="profile-edit-group">
                                    <label className="profile-edit-label">Position</label>
                                    <div className="profile-edit-pills">
                                        {['Goalkeeper', 'Defender', 'Midfielder', 'Forward'].map(function (pos) {
                                            return (
                                                <button
                                                    key={pos}
                                                    className={editPosition === pos ? 'profile-pill active' : 'profile-pill'}
                                                    onClick={function () { setEditPosition(pos) }}
                                                >
                                                    {pos}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="profile-edit-group">
                                    <label className="profile-edit-label">Skill Level</label>
                                    <div className="profile-edit-pills">
                                        {['Beginner', 'Intermediate', 'Advanced'].map(function (level) {
                                            return (
                                                <button
                                                    key={level}
                                                    className={editSkillLevel === level ? 'profile-pill active' : 'profile-pill'}
                                                    onClick={function () { setEditSkillLevel(level) }}
                                                >
                                                    {level}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="profile-edit-actions">
                            <button
                                className="btn-cancel-edit"
                                onClick={function () { setIsEditing(false) }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-save-profile"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                )}

            </div>

            <Footer />

        </div>
    )
}

export default ProfilePage