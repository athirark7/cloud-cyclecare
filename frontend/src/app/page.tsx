'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="landing-container animate-fade-in">
      <section className="hero">
        <h1>Track Your Cycle, <span className="text-gradient">Empower Your Life</span></h1>
        <p className="hero-subtitle">
          Unlock insights into your hormonal health with CycleCare's intelligent tracking and personalized analysis.
        </p>
        <div className="hero-actions">
          <Link href="/signup" className="btn btn-primary btn-lg">Get Started Free</Link>
          <Link href="/login" className="btn btn-outline btn-lg">Welcome Back</Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card glass-card">
          <div className="feature-icon">📅</div>
          <h3>Smart Predictions</h3>
          <p>Get accurate predictions for your next period based on your unique cycle history.</p>
        </div>
        <div className="feature-card glass-card">
          <div className="feature-icon">📊</div>
          <h3>Health Insights</h3>
          <p>Identify patterns in your symptoms and moods with our intuitive data visualizations.</p>
        </div>
        <div className="feature-card glass-card">
          <div className="feature-icon">🔒</div>
          <h3>Private & Secure</h3>
          <p>Your health data is encrypted and secure. We prioritize your privacy above everything else.</p>
        </div>
      </section>

      <style jsx>{`
        .landing-container {
          padding: 4rem 1rem;
        }
        .hero {
          text-align: center;
          margin-bottom: 6rem;
        }
        h1 {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }
        .text-gradient {
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 1.3rem;
          color: var(--text-muted);
          max-width: 700px;
          margin: 0 auto 3rem;
        }
        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }
        .btn-lg {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
        }
        .btn-outline {
          background: transparent;
          border: 2px solid var(--primary);
          color: var(--primary);
        }
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        .feature-card {
          text-align: center;
          padding: 3rem 2rem;
        }
        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
        }
        h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        p {
          color: var(--text-muted);
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
