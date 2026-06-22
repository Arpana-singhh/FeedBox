"use client";

import { useState } from "react";

// Static data – recent feedbacks for this project
const RECENT_FEEDBACKS = [
  {
    id      : "fb-001",
    userName: "Priya Sharma",
    rating  : 5,
    message : "Absolutely love the UI kit! The components are well-thought-out and saved our team at least 2 weeks of design work.",
    date    : "20 Jun 2026",
  },
  {
    id      : "fb-002",
    userName: "Rahul Mehta",
    rating  : 4,
    message : "Great project overall. Would love to see more chart components and better dark mode support in the next release.",
    date    : "18 Jun 2026",
  },
  {
    id      : "fb-003",
    userName: "Sneha Patel",
    rating  : 5,
    message : "We integrated this into our SaaS product and the consistency it brings is outstanding. Documentation is very clear.",
    date    : "15 Jun 2026",
  },
];

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0);

  return (
    <span className="fb-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`fb-star ${s <= (hovered || value) ? "filled" : ""}`}
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span className="fb-stars" style={{ cursor: "default" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`fb-star ${s <= rating ? "filled" : ""}`} style={{ cursor: "default" }}>★</span>
      ))}
    </span>
  );
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function FeedbackPage() {
  const [rating,   setRating]   = useState(0);
  const [userName, setUserName] = useState("");
  const [message,  setMessage]  = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Static project info – will come from Firestore later
  const project = { name: "Designify UI Kit", id: "proj-001" };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Firebase write will go here
    setSubmitted(true);
  }

  return (
    <>
      {/* ── Page Header ── */}
      <div className="fb-page-header">
        <div className="container">
          <div className="d-flex align-items-center gap-3">
            <a href="/" className="fb-btn fb-btn-ghost fb-btn-sm">← Back</a>
            <div>
              <h1 className="fb-page-title">{project.name}</h1>
              <p  className="fb-page-subtitle">Share your experience with this project</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fb-section">
        <div className="container">
          <div className="row g-4 justify-content-center">

            {/* ── Feedback Form ── */}
            <div className="col-12 col-lg-5">
              <div className="fb-card" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>

                <h2 className="fb-section-title mb-1">Leave a Review</h2>
                <p  className="fb-section-subtitle">Your feedback helps improve the project</p>

                <hr className="fb-divider" />

                {submitted ? (
                  /* ── Success State ── */
                  <div className="fb-empty">
                    <div className="fb-empty-icon">🎉</div>
                    <div className="fb-empty-title">Thank you for your feedback!</div>
                    <div className="fb-empty-desc mb-3">Your response has been recorded.</div>
                    <button
                      className="fb-btn fb-btn-outline"
                      onClick={() => { setSubmitted(false); setRating(0); setUserName(""); setMessage(""); }}
                    >
                      Submit Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>

                    {/* Name */}
                    <div className="fb-form-group">
                      <label htmlFor="userName">Your Name</label>
                      <input
                        id="userName"
                        type="text"
                        className="fb-input"
                        placeholder="e.g. Rahul Mehta"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                      />
                    </div>

                    {/* Rating */}
                    <div className="fb-form-group">
                      <label>Rating</label>
                      <div className="d-flex align-items-center gap-3">
                        <StarPicker value={rating} onChange={setRating} />
                        {rating > 0 && (
                          <span className="fb-badge fb-badge-warning">{rating} / 5</span>
                        )}
                        {rating === 0 && (
                          <span style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>Click to rate</span>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="fb-form-group">
                      <label htmlFor="message">Your Feedback</label>
                      <textarea
                        id="message"
                        className="fb-textarea"
                        placeholder="What did you like or dislike? Any suggestions?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="fb-btn fb-btn-primary w-100"
                      disabled={rating === 0}
                    >
                      Submit Feedback
                    </button>

                    {rating === 0 && (
                      <p style={{ fontSize: "0.78rem", color: "#9CA3AF", textAlign: "center", marginTop: "0.5rem" }}>
                        Please select a rating to continue
                      </p>
                    )}

                  </form>
                )}

              </div>
            </div>

            {/* ── Recent Feedbacks ── */}
            <div className="col-12 col-lg-7">
              <h2 className="fb-section-title mb-1">Recent Feedback</h2>
              <p  className="fb-section-subtitle">{RECENT_FEEDBACKS.length} responses for {project.name}</p>

              <div className="d-flex flex-column gap-3">
                {RECENT_FEEDBACKS.map((fb) => (
                  <div key={fb.id} className="fb-feedback-card">

                    <div className="fb-feedback-header">
                      <div className="fb-feedback-user">
                        <div className="fb-avatar">{getInitials(fb.userName)}</div>
                        <div>
                          <div className="fb-feedback-name">{fb.userName}</div>
                          <div className="fb-feedback-date">{fb.date}</div>
                        </div>
                      </div>
                      <StarDisplay rating={fb.rating} />
                    </div>

                    <p className="fb-feedback-msg">{fb.message}</p>

                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
