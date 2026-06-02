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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#16A34A" />
                <circle cx="12" cy="10" r="3" fill="white" />
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