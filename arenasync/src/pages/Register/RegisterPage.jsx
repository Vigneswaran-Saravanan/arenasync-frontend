import { useState } from "react";
import { useNavigate } from "react-router-dom"
import './RegisterPage.css'
import { registerUser } from "../../services/api"

function RegisterPage({ setRole }) {

    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [selectedRole, setSelectedRole] = useState('')
    const [city, setCity] = useState('')
    const [skillLevel, setSkillLevel] = useState('')
    const [position, setPosition] = useState('')

    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState('')
    const [loading, setLoading] = useState(false)

    function validate() {
        const newErrors = {}

        if (!name.trim()) {
            newErrors.name = 'Full name required'
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!email.includes('@')) {
            newErrors.email = 'Please enter a valid email'
        }

        if (!password) {
            newErrors.password = 'Password is required'
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        if (!selectedRole) {
            newErrors.role = 'Please select a role'
        }

        return newErrors
    }

    async function handleSubmit() {
        setServerError('')

        const newErrors = validate()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setErrors({})
        setLoading(true)

        try {
            const response = await registerUser({
                name,
                email,
                password,
                role: selectedRole,
                city,
                skillLevel: selectedRole === 'Player' ? skillLevel : '',
                position: selectedRole === 'Player' ? position : '',
            })

            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            setRole(response.data.user.role)

            navigate(
                response.data.user.role === 'Organizer' ? '/my-matches' :
                response.data.user.role === 'Venue Host' ? '/my-venues' :
                '/home'
            )
        } catch (error) {
            if (error.response && error.response.data.message) {
                setServerError(error.response.data.message)
            } else {
                setServerError('Something went wrong. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="register-page">
            <div className="register-card">

                {/* Logo */}
                <div className="register-logo" onClick={function () { navigate('/') }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="50" viewBox="0 0 64 73">
                        <defs>
                            <clipPath id="field">
                                <circle cx="32" cy="29" r="19" />
                            </clipPath>
                        </defs>
                        <path d="M32 3C17 3 5 15 5 30C5 42 12.5 52 22 60L32 73L42 60C51.5 52 59 42 59 30C59 15 47 3 32 3Z" fill="#16A34A" />
                        <circle cx="32" cy="29" r="20.5" fill="none" stroke="white" strokeWidth="1.7" />
                        <circle cx="32" cy="29" r="19" fill="#16A34A" />
                        <g clipPath="url(#field)" fill="none" stroke="white" strokeWidth="0.9"
                            strokeLinecap="round" strokeLinejoin="round">
                            <rect x="14" y="9" width="36" height="40" />
                            <line x1="14" y1="29" x2="50" y2="29" />
                            <circle cx="32" cy="29" r="7" />
                            <circle cx="32" cy="29" r="0.8" fill="white" stroke="none" />
                            <rect x="19" y="9" width="26" height="9" />
                            <rect x="23" y="9" width="18" height="4" />
                            <rect x="19" y="40" width="26" height="9" />
                            <rect x="23" y="45" width="18" height="4" />
                        </g>
                    </svg>
                    <span className="register-logo-text">
                        Arena<span className="register-logo-green">Sync</span>
                    </span>
                </div>

                <h1 className="register-heading">Create Your Account</h1>
                <p className="register-subheading">Join your local soccer community</p>

                {serverError && (
                    <div className="error-banner">{serverError}</div>
                )}

                {/* Full Name */}
                <div className="form-group">
                    <label className="form-label">Full Name <span style={{ color: '#DC2626' }}>*</span></label>
                    <input
                        type="text"
                        className={errors.name ? 'form-input error' : 'form-input'}
                        placeholder="John Doe"
                        value={name}
                        onChange={function (e) { setName(e.target.value) }}
                    />
                    {errors.name && <p className="form-error">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="form-group">
                    <label className="form-label">Email <span style={{ color: '#DC2626' }}>*</span></label>
                    <input
                        type="email"
                        className={errors.email ? 'form-input error' : 'form-input'}
                        placeholder="you@example.com"
                        value={email}
                        onChange={function (e) { setEmail(e.target.value) }}
                    />
                    {errors.email && <p className="form-error">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="form-group">
                    <label className="form-label">Password <span style={{ color: '#DC2626' }}>*</span></label>
                    <input
                        type="password"
                        className={errors.password ? 'form-input error' : 'form-input'}
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={function (e) { setPassword(e.target.value) }}
                    />
                    {errors.password && <p className="form-error">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                    <label className="form-label">Confirm Password <span style={{ color: '#DC2626' }}>*</span></label>
                    <input
                        type="password"
                        className={errors.confirmPassword ? 'form-input error' : 'form-input'}
                        placeholder="Repeat your password"
                        value={confirmPassword}
                        onChange={function (e) { setConfirmPassword(e.target.value) }}
                    />
                    {errors.confirmPassword && (
                        <p className="form-error">{errors.confirmPassword}</p>
                    )}
                </div>

                {/* Role — moved up so form adapts below it */}
                <div className="form-group">
                    <label className="form-label">I am a... <span style={{ color: '#DC2626' }}>*</span></label>
                    <div className="role-pills">
                        {['Player', 'Organizer', 'Venue Host'].map(function (r) {
                            return (
                                <button
                                    key={r}
                                    className={selectedRole === r ? 'role-pill active' : 'role-pill'}
                                    onClick={function () {
                                        setSelectedRole(r)
                                        // Clear player-only fields when switching away from Player
                                        if (r !== 'Player') {
                                            setSkillLevel('')
                                            setPosition('')
                                        }
                                    }}
                                >
                                    {r}
                                </button>
                            )
                        })}
                    </div>
                    {errors.role && <p className="form-error">{errors.role}</p>}
                </div>

                {/* City — shown for all roles */}
                <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Toronto"
                        value={city}
                        onChange={function (e) { setCity(e.target.value) }}
                    />
                </div>

                {/* Position — Player only */}
                {selectedRole === 'Player' && (
                    <div className="form-group">
                        <label className="form-label">Position</label>
                        <div className="skill-pills">
                            {['Goalkeeper', 'Defender', 'Midfielder', 'Forward'].map(function (pos) {
                                return (
                                    <button
                                        key={pos}
                                        className={position === pos ? 'skill-pill active' : 'skill-pill'}
                                        onClick={function () { setPosition(pos) }}
                                    >
                                        {pos}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Skill Level — Player only */}
                {selectedRole === 'Player' && (
                    <div className="form-group">
                        <label className="form-label">Skill Level</label>
                        <div className="skill-pills">
                            {['Beginner', 'Intermediate', 'Advanced'].map(function (level) {
                                return (
                                    <button
                                        key={level}
                                        className={skillLevel === level ? 'skill-pill active' : 'skill-pill'}
                                        onClick={function () { setSkillLevel(level) }}
                                    >
                                        {level}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Required note */}
                <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>
                    <span style={{ color: '#DC2626' }}>*</span> Required field
                </p>

                {/* Submit */}
                <button
                    className="btn-register"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Register'}
                </button>

                {/* Bottom link */}
                <div className="register-bottom">
                    Already have an account?{' '}
                    <span onClick={function () { navigate('/login') }}>
                        Sign In
                    </span>
                </div>

            </div>
        </div>
    )
}

export default RegisterPage