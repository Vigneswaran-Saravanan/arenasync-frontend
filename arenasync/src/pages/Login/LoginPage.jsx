import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'
import { loginUser } from '../../services/api'

function LoginPage({ setRole }) {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState('')
    const [loading, setLoading] = useState(false)

    // Validate form before submitting
    function validate() {
        const newErrors = {}

        if (!email.trim()) {
            newErrors.email = 'Email is required'
        }

        if (!password) {
            newErrors.password = 'Password is required'
        }

        return newErrors
    }

    // Handle form submit
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
            const response = await loginUser({ email, password })

            // Save token and user info to localStorage
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            setRole(response.data.user.role)

            // Redirect based on role
            navigate(
                response.data.user.role === 'Organizer' ? '/my-matches' :
                response.data.user.role === 'Venue Host' ? '/my-venues' :
                response.data.user.role === 'Admin' ? '/admin' :
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
        <div className="login-page">
            <div className="login-card">

                {/* Logo */}
                <div className="login-logo" onClick={function () { navigate('/') }}>
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
                    <span className="login-logo-text">
                        Arena<span className="login-logo-green">Sync</span>
                    </span>
                </div>

                <h1 className="login-heading">Welcome Back</h1>
                <p className="login-subheading">Sign in to find your next game</p>

                {serverError && (
                    <div className="error-banner">{serverError}</div>
                )}

                {/* Email */}
                <div className="form-group">
                    <label className="form-label">Email</label>
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
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className={errors.password ? 'form-input error' : 'form-input'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={function (e) { setPassword(e.target.value) }}
                    />
                    {errors.password && <p className="form-error">{errors.password}</p>}
                </div>

                {/* Submit */}
                <button
                    className="btn-login"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>

                {/* Bottom link */}
                <div className="login-bottom">
                    Don't have an account?{' '}
                    <span onClick={function () { navigate('/register') }}>
                        Register
                    </span>
                </div>

            </div>
        </div>
    )
}

export default LoginPage