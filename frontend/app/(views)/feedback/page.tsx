"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Input, Button } from "antd";
import toast from "react-hot-toast";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getOrCreateProject }   from "@/controllers/projectController";
import { submitFeedback, getProjectFeedbacks } from "@/controllers/feedbackController";
import type { Project }  from "@/services/projectService";
import type { Feedback } from "@/services/feedbackService";

// ── Validation schema ─────────────────────────────────────────────────────────
const feedbackSchema = Yup.object({
  userName: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
  message : Yup.string().min(10, "Feedback must be at least 10 characters").required("Feedback is required"),
});

// ── Star components ───────────────────────────────────────────────────────────
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
        >★</span>
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

// ── Page ─────────────────────────────────────────────────────────────────────
export default function FeedbackPage() {
  const searchParams = useSearchParams();
  const key          = searchParams.get("key") || "";  // /feedback?key=notifyapp

  const [project,     setProject]     = useState<Project | null>(null);
  const [feedbacks,   setFeedbacks]   = useState<Feedback[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [rating,      setRating]      = useState(0);
  const [ratingError, setRatingError] = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined); // undefined = still checking

  // Track Firebase auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsub();
  }, []);

  // ── Load project and feedbacks on mount ────────────────────────────────────
  useEffect(() => {
    if (!key) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        // Step 1 — get or auto-create project by key
        const proj = await getOrCreateProject(key);
        setProject(proj);

        // Step 2 — load existing feedbacks for this project
        const list = await getProjectFeedbacks(key);
        setFeedbacks(list);

      } catch {
        toast.error("Failed to load project. Please try again.", { id: "fb-toast" });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [key]);

  // ── Form submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (
    values: { userName: string; message: string },
    { setSubmitting, resetForm }: { setSubmitting: (v: boolean) => void; resetForm: () => void }
  ) => {
    if (rating === 0) {
      setRatingError(true);
      setSubmitting(false);
      return;
    }

    if (!project) return;

    const result = await submitFeedback({
      projectId : project.projectId,
      projectKey: project.key,
      userName  : values.userName,
      rating,
      message   : values.message,
    });

    if (!result.success) {
      toast.error(result.error || "Failed to submit feedback.", { id: "fb-toast" });
      setSubmitting(false);
      return;
    }

    // Refresh feedbacks list after successful submit
    const updated = await getProjectFeedbacks(key);
    setFeedbacks(updated);

    toast.success("Feedback submitted!", { id: "fb-toast" });
    setSubmitted(true);
    resetForm();
    setRating(0);
    setRatingError(false);
    setSubmitting(false);
  };

  // ── No key in URL ──────────────────────────────────────────────────────────
  if (!key) {
    return (
      <div className="fb-empty" style={{ marginTop: "4rem" }}>
        <div className="fb-empty-icon">🔗</div>
        <div className="fb-empty-title">No project key provided</div>
        <div className="fb-empty-desc">Use a link like <code>/feedback?key=yourproject</code></div>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading || currentUser === undefined) {
    return (
      <div className="fb-empty" style={{ marginTop: "4rem" }}>
        <div className="fb-empty-desc">Loading project...</div>
      </div>
    );
  }

  // ── Private project gate ───────────────────────────────────────────────────
  if (project?.type === "private" && !currentUser) {
    return (
      <div className="fb-empty" style={{ marginTop: "4rem" }}>
        <div className="fb-empty-icon">🔒</div>
        <div className="fb-empty-title">This is a private project</div>
        <div className="fb-empty-desc mb-3">You need to be logged in to submit feedback.</div>
        <a href={`/login?redirect=/feedback?key=${key}`} className="fb-btn fb-btn-primary">
          Login to Continue
        </a>
      </div>
    );
  }

  return (
    <>
      {/* ── Page Header ── */}
      <div className="fb-page-header">
        <div className="container">
          <div className="d-flex align-items-center gap-3">
            <a href="/" className="fb-btn fb-btn-ghost fb-btn-sm">← Back</a>
            <div>
              <h1 className="fb-page-title">{project?.name}</h1>
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
                  <div className="fb-empty">
                    <div className="fb-empty-icon">🎉</div>
                    <div className="fb-empty-title">Thank you for your feedback!</div>
                    <div className="fb-empty-desc mb-3">Your response has been recorded.</div>
                    <Button onClick={() => setSubmitted(false)}>Submit Another</Button>
                  </div>
                ) : (
                  <Formik
                    initialValues={{ userName: "", message: "" }}
                    validationSchema={feedbackSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                      <Form>

                        <div className="fb-form-group">
                          <label htmlFor="userName">Your Name</label>
                          <Input
                            id="userName"
                            name="userName"
                            size="large"
                            placeholder="e.g. Rahul Mehta"
                            value={values.userName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            status={touched.userName && errors.userName ? "error" : ""}
                          />
                          {touched.userName && errors.userName && (
                            <small className="text-danger">{errors.userName}</small>
                          )}
                        </div>

                        <div className="fb-form-group">
                          <label>Rating</label>
                          <div className="d-flex align-items-center gap-3">
                            <StarPicker value={rating} onChange={(n) => { setRating(n); setRatingError(false); }} />
                            {rating > 0 && <span className="fb-badge fb-badge-warning">{rating} / 5</span>}
                            {rating === 0 && <span style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>Click to rate</span>}
                          </div>
                          {ratingError && <small className="text-danger">Please select a rating</small>}
                        </div>

                        <div className="fb-form-group">
                          <label htmlFor="message">Your Feedback</label>
                          <Input.TextArea
                            id="message"
                            name="message"
                            size="large"
                            placeholder="What did you like or dislike? Any suggestions?"
                            value={values.message}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            status={touched.message && errors.message ? "error" : ""}
                            rows={4}
                          />
                          {touched.message && errors.message && (
                            <small className="text-danger">{errors.message}</small>
                          )}
                        </div>

                        <Button
                          type="primary"
                          htmlType="submit"
                          size="large"
                          block
                          loading={isSubmitting}
                          disabled={rating === 0}
                        >
                          Submit Feedback
                        </Button>

                        {rating === 0 && (
                          <p style={{ fontSize: "0.78rem", color: "#9CA3AF", textAlign: "center", marginTop: "0.5rem" }}>
                            Please select a rating to continue
                          </p>
                        )}

                      </Form>
                    )}
                  </Formik>
                )}

              </div>
            </div>

            {/* ── Recent Feedbacks ── */}
            <div className="col-12 col-lg-7">
              <h2 className="fb-section-title mb-1">Recent Feedback</h2>
              <p  className="fb-section-subtitle">{feedbacks.length} responses for {project?.name}</p>

              {feedbacks.length === 0 ? (
                <div className="fb-empty">
                  <div className="fb-empty-icon">💬</div>
                  <div className="fb-empty-title">No feedback yet</div>
                  <div className="fb-empty-desc">Be the first to leave a review!</div>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {feedbacks.map((fb) => (
                    <div key={fb.feedbackId} className="fb-feedback-card">
                      <div className="fb-feedback-header">
                        <div className="fb-feedback-user">
                          <div className="fb-avatar">{getInitials(fb.userName)}</div>
                          <div>
                            <div className="fb-feedback-name">{fb.userName}</div>
                            <div className="fb-feedback-date">
                              {fb.createdAt
                                ? new Date((fb.createdAt as { seconds: number }).seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                                : "Just now"}
                            </div>
                          </div>
                        </div>
                        <StarDisplay rating={fb.rating} />
                      </div>
                      <p className="fb-feedback-msg">{fb.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
