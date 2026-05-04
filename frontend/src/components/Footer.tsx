'use client';

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-info">
          <h3>CycleCare</h3>
          <p>Your personal companion for menstrual health tracking and insights.</p>
        </div>
        <div className="footer-links">
          <p>&copy; {new Date().getFullYear()} CycleCare. All rights reserved.</p>
          <div className="socials">
              {/* Social icons can go here */}
          </div>
        </div>
      </div>
      <style jsx>{`
        .footer {
          margin-top: auto;
          padding: 4rem 0 2rem;
          background: var(--glass-bg);
          border-top: 1px solid var(--glass-border);
        }
        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          text-align: center;
        }
        .footer-info h3 {
          color: var(--primary);
          margin-bottom: 0.5rem;
        }
        .footer-info p {
          color: var(--text-muted);
          max-width: 400px;
        }
        .footer-links p {
          font-size: 0.9rem;
          color: var(--text-muted);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
