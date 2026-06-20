import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './BrowseVenuesPage.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

function BrowseVenuesPage({ role, setRole }) {

    const navigate = useNavigate()

    const [venues, setVenues] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(function () {
        async function fetchVenues() {
            try {
                const res = await axios.get('http://localhost:5000/api/venues')
                setVenues(res.data.venues)
            } catch (err) {
                setError('Could not load venues.')
            } finally {
                setLoading(false)
            }
        }
        fetchVenues()
    }, [])

    // Selecting a venue here sends its data back to Create Match via navigation state
    function handleUseVenue(venue) {
        navigate('/create-match', {
            state: {
                selectedVenue: {
                    venueId: venue._id,
                    name: venue.name,
                    address: venue.address
                }
            }
        })
    }

    if (loading) {
        return (
            <div className="browse-venues-page">
                <Navbar role={role} setRole={setRole} />
                <div style={{ padding: 60, textAlign: 'center', color: '#6B7280' }}>Loading venues...</div>
            </div>
        )
    }

    return (
        <div className="browse-venues-page">

            <Navbar role={role} setRole={setRole} />

            <div className="browse-venues-content">

                <button className="browse-venues-back-btn" onClick={function () { navigate('/create-match') }}>
                    ← Back to Create Match
                </button>

                <h1 className="browse-venues-heading">Browse Venues</h1>
                <p className="browse-venues-subheading">Pick a registered venue for your match</p>

                {error && (
                    <p style={{ color: '#DC2626', marginBottom: 16 }}>{error}</p>
                )}

                {venues.length === 0 ? (
                    <div className="browse-venues-empty">No registered venues available yet</div>
                ) : (
                    venues.map(function (venue) {
                        return (
                            <div key={venue._id} className="browse-venue-card">

                                <div className="browse-venue-info">
                                    <h3 className="browse-venue-title">{venue.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                        <p className="browse-venue-address" style={{ margin: 0 }}>{venue.address}</p>

                                        <a href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(venue.address || '')}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{ fontSize: 12, fontWeight: 600, color: '#16A34A', textDecoration: 'none' }}
                                        >
                                            Get Directions
                                        </a>
                                    </div>
                                    <div className="browse-venue-meta">
                                        <span>{venue.fieldType || 'Not specified'}</span>
                                        <span>{venue.capacity} players</span>
                                    </div>
                                </div>

                                <div className="browse-venue-actions">
                                    <button
                                        className="btn-view-venue-details"
                                        onClick={function () { navigate('/venue/' + venue._id) }}
                                    >
                                        View Details
                                    </button>
                                    <button
                                        className="btn-use-this-venue"
                                        onClick={function () { handleUseVenue(venue) }}
                                    >
                                        Use This Venue
                                    </button>
                                </div>

                            </div>
                        )
                    })
                )}

            </div>

            <Footer />

        </div >
    )
}

export default BrowseVenuesPage