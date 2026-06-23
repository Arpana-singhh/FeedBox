"use client";

import { useEffect, useState } from "react";
import { getInitials } from "@/utils/helper";
import { StarDisplay } from "@/utils/feedbackUtils";
import { Select } from "antd";
import { getAllFeedbacks } from "@/models/feedbackModel";
import { getProjects } from "@/models/projectModel";
import type { Feedback } from "@/services/feedbackService";
import type { Project } from "@/services/projectService";

function ratingBadgeClass(rating: number) {
  if (rating >= 5) return "fb-badge-success";
  if (rating >= 4) return "fb-badge-primary";
  return "fb-badge-warning";
}

function formatDate(createdAt: unknown): string {
  if (!createdAt) return "Just now";
  return new Date((createdAt as { seconds: number }).seconds * 1000)
    .toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function avgRating(feedbacks: Feedback[]): string {
  if (!feedbacks.length) return "0.0";
  const sum = feedbacks.reduce((acc, fb) => acc + fb.rating, 0);
  return (sum / feedbacks.length).toFixed(1);
}

export default function DashboardPage() {
  const [feedbacks,       setFeedbacks]       = useState<Feedback[]>([]);
  const [projects,        setProjects]        = useState<Project[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [projectFilter,   setProjectFilter]   = useState("");
  const [ratingFilter,    setRatingFilter]    = useState("");

  useEffect(() => {
    Promise.all([getAllFeedbacks(), getProjects()])
      .then(([fbs, projs]) => { setFeedbacks(fbs); setProjects(projs); })
      .finally(() => setLoading(false));
  }, []);

  const projectNameMap = Object.fromEntries(projects.map((p) => [p.key, p.name]));

  const filtered = feedbacks.filter((fb) => {
    const matchProject = !projectFilter || fb.projectKey === projectFilter;
    const matchRating  = !ratingFilter  || fb.rating === Number(ratingFilter);
    return matchProject && matchRating;
  });

  const stats = [
    { icon: "📁", label: "Total Projects",  value: loading ? "—" : String(projects.length),  iconClass: "icon-primary" },
    { icon: "💬", label: "Total Feedbacks", value: loading ? "—" : String(feedbacks.length), iconClass: "icon-success" },
    { icon: "⭐", label: "Average Rating",  value: loading ? "—" : avgRating(feedbacks),     iconClass: "icon-warning" },
  ];

  return (
    <>
      {/* ── Page Header ── */}
      <div className="fb-page-header">
        <div className="container">
          <h1 className="fb-page-title">Dashboard</h1>
          <p  className="fb-page-subtitle">Overview of all projects and feedback responses</p>
        </div>
      </div>

      <div className="fb-section">
        <div className="container">

          {/* ── Stats ── */}
          <div className="row g-3 mb-4">
            {stats.map((stat) => (
              <div key={stat.label} className="col-12 col-sm-4">
                <div className="fb-stat-card">
                  <div className={`fb-stat-icon ${stat.iconClass}`}>{stat.icon}</div>
                  <div className="fb-stat-value">{stat.value}</div>
                  <div className="fb-stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Filters + heading ── */}
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <div>
              <h2 className="fb-section-title mb-0">All Feedback</h2>
              <p  className="fb-section-subtitle mb-0">
                {loading ? "Loading..." : `${filtered.length} response${filtered.length !== 1 ? "s" : ""} across all projects`}
              </p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Select
                style={{ width: 160 }}
                value={projectFilter}
                onChange={(val) => setProjectFilter(val)}
                options={[
                  { value: "", label: "All Projects" },
                  ...projects.map((p) => ({ value: p.key, label: p.name })),
                ]}
              />
              <Select
                style={{ width: 140 }}
                value={ratingFilter}
                onChange={(val) => setRatingFilter(val)}
                options={[
                  { value: "", label: "All Ratings" },
                  ...[5, 4, 3, 2, 1].map((r) => ({ value: String(r), label: `${r} Star${r !== 1 ? "s" : ""}` })),
                ]}
              />
            </div>
          </div>

          {/* ── Loading ── */}
          {loading && (
            <div className="fb-empty">
              <div className="fb-empty-desc">Loading feedback...</div>
            </div>
          )}

          {/* ── Empty ── */}
          {!loading && filtered.length === 0 && (
            <div className="fb-empty">
              <div className="fb-empty-icon">💬</div>
              <div className="fb-empty-title">No feedback yet</div>
              <div className="fb-empty-desc">Feedback submitted by users will appear here.</div>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <>
              {/* Desktop Table */}
              <div className="fb-table-wrapper d-none d-md-block">
                <table className="fb-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Project</th>
                      <th>Rating</th>
                      <th>Message</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((fb) => (
                      <tr key={fb.feedbackId}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="fb-avatar" style={{ width: 30, height: 30, fontSize: "0.7rem" }}>
                              {getInitials(fb.userName)}
                            </div>
                            <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>{fb.userName}</span>
                          </div>
                        </td>
                        <td>
                          <span className="fb-badge fb-badge-gray">{projectNameMap[fb.projectKey] || fb.projectKey}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <StarDisplay rating={fb.rating} />
                            <span className={`fb-badge ${ratingBadgeClass(fb.rating)}`}>{fb.rating}</span>
                          </div>
                        </td>
                        <td style={{ maxWidth: 340 }}>
                          <span style={{ color: "#374151", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {fb.message}
                          </span>
                        </td>
                        <td style={{ whiteSpace: "nowrap", color: "#6B7280" }}>{formatDate(fb.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="d-flex flex-column gap-3 d-md-none">
                {filtered.map((fb) => (
                  <div key={fb.feedbackId} className="fb-feedback-card">
                    <div className="fb-feedback-header">
                      <div className="fb-feedback-user">
                        <div className="fb-avatar">{getInitials(fb.userName)}</div>
                        <div>
                          <div className="fb-feedback-name">{fb.userName}</div>
                          <div className="fb-feedback-date">{formatDate(fb.createdAt)}</div>
                        </div>
                      </div>
                      <StarDisplay rating={fb.rating} />
                    </div>
                    <span className="fb-badge fb-badge-gray mb-2 d-inline-block">{projectNameMap[fb.projectKey] || fb.projectKey}</span>
                    <p className="fb-feedback-msg">{fb.message}</p>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}
