// Static projects list — home page

const PROJECTS = [
  {
    id         : "proj-001",
    name       : "Designify UI Kit",
    description: "A comprehensive React component library for modern SaaS products. Includes 80+ components.",
    feedbackCount: 24,
    avgRating  : 4.7,
    category   : "Design",
  },
  {
    id         : "proj-002",
    name       : "TaskFlow App",
    description: "Kanban-style project management tool built for remote teams. Drag & drop, real-time updates.",
    feedbackCount: 18,
    avgRating  : 4.2,
    category   : "Productivity",
  },
  {
    id         : "proj-003",
    name       : "ShopLens Analytics",
    description: "E-commerce analytics dashboard that tracks customer behaviour, funnels, and conversion rates.",
    feedbackCount: 9,
    avgRating  : 3.8,
    category   : "Analytics",
  },
  {
    id         : "proj-004",
    name       : "AuthGuard SDK",
    description: "Drop-in authentication SDK with OAuth 2.0, magic links, and 2-FA out of the box.",
    feedbackCount: 31,
    avgRating  : 4.9,
    category   : "Developer Tool",
  },
  {
    id         : "proj-005",
    name       : "NotifyPulse",
    description: "Smart notification service that sends push, email, and SMS alerts based on user behaviour.",
    feedbackCount: 6,
    avgRating  : 4.0,
    category   : "Communication",
  },
  {
    id         : "proj-006",
    name       : "DataMesh API",
    description: "Unified data API that connects multiple databases and exposes a single GraphQL endpoint.",
    feedbackCount: 12,
    avgRating  : 4.5,
    category   : "Backend",
  },
];

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span className="fb-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`fb-star ${s <= Math.round(rating) ? "filled" : ""}`}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function ProjectsPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="fb-hero">
        <div className="container">
          <h1 className="fb-hero-title">
            Collect <span>smarter feedback</span><br />for every project
          </h1>
          <p className="fb-hero-subtitle">
            Share a link, let users rate and review, and see all responses in
            one clean dashboard — powered by Firebase.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <a href="/feedback" className="fb-btn fb-btn-primary fb-btn-lg">
              Submit Feedback
            </a>
            <a href="/dashboard" className="fb-btn fb-btn-ghost fb-btn-lg">
              View Dashboard
            </a>
          </div>
        </div>
      </section>

      {/* ── Projects grid ── */}
      <section className="fb-section">
        <div className="container">

          {/* Section header */}
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <div>
              <h2 className="fb-section-title mb-0">All Projects</h2>
              <p className="fb-section-subtitle mb-0">{PROJECTS.length} projects · collecting feedback</p>
            </div>
            <button className="fb-btn fb-btn-outline">+ Add Project</button>
          </div>

          {/* Cards */}
          <div className="row g-3">
            {PROJECTS.map((project) => (
              <div key={project.id} className="col-12 col-md-6 col-lg-4">
                <div className="fb-card d-flex flex-column">

                  {/* Top */}
                  <div className="d-flex align-items-start justify-content-between mb-2">
                    <span className="fb-badge fb-badge-primary">{project.category}</span>
                    <span className="fb-card-meta">
                      <span>💬</span> {project.feedbackCount}
                    </span>
                  </div>

                  <h3 className="fb-card-title">{project.name}</h3>
                  <p  className="fb-card-desc">{project.description}</p>

                  {/* Rating row */}
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <StarDisplay rating={project.avgRating} />
                    <span className="fb-card-meta">{project.avgRating.toFixed(1)} avg</span>
                  </div>

                  {/* Footer */}
                  <div className="fb-card-footer">
                    <a
                      href={`/feedback?projectId=${project.id}`}
                      className="fb-btn fb-btn-primary fb-btn-sm"
                    >
                      Share Feedback
                    </a>
                    <a
                      href={`/dashboard?projectId=${project.id}`}
                      className="fb-btn fb-btn-ghost fb-btn-sm"
                    >
                      View Responses
                    </a>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
