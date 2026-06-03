import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-columns">

          {/* Column 1 — Brand */}
          <div>
            <div className="footer-logo">
              {/* YOUR LOGO SVG HERE */}
              <svg xmlns="http://www.w3.org/2000/svg" width="42" height="50" viewBox="0 0 64 73">
                <defs>
                  <clipPath id="field">
                    <circle cx="32" cy="29" r="19" />
                  </clipPath>
                </defs>

                <path d="M32 3C17 3 5 15 5 30C5 42 12.5 52 22 60L32 73L42 60C51.5 52 59 42 59 30C59 15 47 3 32 3Z" fill="#16A34A" />

                <circle cx="32" cy="29" r="20.5" fill="none" stroke="white" stroke-width="1.7" />

                <circle cx="32" cy="29" r="19" fill="#16A34A" />

                <g clip-path="url(#field)" fill="none" stroke="white" stroke-width="0.9"
                  stroke-linecap="round" stroke-linejoin="round">
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
              <span className="footer-logo-text">
                Arena<span className="footer-logo-green">Sync</span>
              </span>
            </div>
            <p className="footer-tagline">Find your game. Own the pitch.</p>
          </div>

          {/* Column 2 — Platform */}
          <div>
            <p className="footer-heading">Platform</p>
            <button className="footer-link">Find a Match</button>
            <button className="footer-link">Create a Match</button>
            <button className="footer-link">My Matches</button>
            <button className="footer-link">Venues</button>
          </div>

          {/* Column 3 — Support */}
          <div>
            <p className="footer-heading">Support</p>
            <button className="footer-link">Help Center</button>
            <button className="footer-link">Contact Us</button>
            <button className="footer-link">FAQs</button>
            <button className="footer-link">Privacy Policy</button>
          </div>

          {/* Column 4 — App */}
          <div>
            <p className="footer-heading">Get the App</p>
            <button className="footer-app-btn">App Store</button>
            <button className="footer-app-btn">Google Play</button>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span>© 2026 ArenaSync. All rights reserved.</span>
          <span>Terms · Privacy · Cookies</span>
        </div>

      </div>
    </footer>
  )
}

export default Footer