import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ContactPage.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

function ContactPage() {

  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  function validate() {
    const newErrors = {}
    if (!name.trim()) newErrors.name = 'Name is required'
    if (!email.trim()) newErrors.email = 'Email is required'
    if (!message.trim()) newErrors.message = 'Message is required'
    return newErrors
  }

  function handleSubmit() {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})
    setSubmitted(true)
  }

  return (
    <div className="contact-page">

      <Navbar role={null} />

      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <h1 className="contact-hero-heading">Contact Us</h1>
          <p className="contact-hero-sub">
            Have a question about ArenaSync? We are happy to help.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="contact-main">
        <div className="contact-main-inner">

          {/* Left — contact info */}
          <div className="contact-info">

            <h2>Get in touch</h2>
            <p className="contact-info-sub">
              Use the form to send us a message and we will get back to you as soon as possible.
            </p>

            <div className="contact-info-blocks">

              <div className="contact-info-block">
                <div className="contact-info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="22,6 12,13 2,6" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="contact-info-label">Email</p>
                  <p className="contact-info-value">support@arenasync.ca</p>
                </div>
              </div>

              <div className="contact-info-block">
                <div className="contact-info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="10" r="3" stroke="#16A34A" strokeWidth="2" />
                  </svg>
                </div>
                <div>
                  <p className="contact-info-label">Location</p>
                  <p className="contact-info-value">Toronto, Ontario, Canada</p>
                </div>
              </div>

              <div className="contact-info-block">
                <div className="contact-info-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#16A34A" strokeWidth="2" />
                    <polyline points="12 6 12 12 16 14" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="contact-info-label">Response Time</p>
                  <p className="contact-info-value">Within 1 to 2 business days</p>
                </div>
              </div>

            </div>

            <div className="contact-divider" />

            <div className="contact-links">
              <p className="contact-links-label">Quick Links</p>
              <button
                className="contact-quick-link"
                onClick={function () { navigate('/about') }}
              >
                How ArenaSync works
              </button>
              <button
                className="contact-quick-link"
                onClick={function () { navigate('/register') }}
              >
                Create a free account
              </button>
              <button
                className="contact-quick-link"
                onClick={function () { navigate('/login') }}
              >
                Sign in to your account
              </button>
            </div>

          </div>

          {/* Right — form */}
          <div className="contact-form-box">

            {submitted ? (
              <div className="contact-success">
                <div className="contact-success-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
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
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out, {name}. We will get back to you at {email} within 1 to 2 business days.</p>
                <button
                  className="btn-contact-back"
                  onClick={function () { navigate('/') }}
                >
                  Back to Home
                </button>
              </div>
            ) : (
              <>
                <h3 className="contact-form-heading">Send us a message</h3>

                <div className="contact-form-group">
                  <label className="contact-form-label">Full Name</label>
                  <input
                    type="text"
                    className={errors.name ? 'contact-form-input error' : 'contact-form-input'}
                    placeholder="John Doe"
                    value={name}
                    onChange={function (e) { setName(e.target.value) }}
                  />
                  {errors.name && <p className="contact-form-error">{errors.name}</p>}
                </div>

                <div className="contact-form-group">
                  <label className="contact-form-label">Email Address</label>
                  <input
                    type="email"
                    className={errors.email ? 'contact-form-input error' : 'contact-form-input'}
                    placeholder="you@example.com"
                    value={email}
                    onChange={function (e) { setEmail(e.target.value) }}
                  />
                  {errors.email && <p className="contact-form-error">{errors.email}</p>}
                </div>

                <div className="contact-form-group">
                  <label className="contact-form-label">Subject (optional)</label>
                  <input
                    type="text"
                    className="contact-form-input"
                    placeholder="e.g. Question about joining a match"
                    value={subject}
                    onChange={function (e) { setSubject(e.target.value) }}
                  />
                </div>

                <div className="contact-form-group">
                  <label className="contact-form-label">Message</label>
                  <textarea
                    className={errors.message ? 'contact-form-textarea error' : 'contact-form-textarea'}
                    placeholder="Write your message here..."
                    rows={5}
                    value={message}
                    onChange={function (e) { setMessage(e.target.value) }}
                  />
                  {errors.message && <p className="contact-form-error">{errors.message}</p>}
                </div>

                <button
                  className="btn-contact-submit"
                  onClick={handleSubmit}
                >
                  Send Message
                </button>
              </>
            )}

          </div>

        </div>
      </section>

      <Footer />

    </div>
  )
}

export default ContactPage