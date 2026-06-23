// Static dashboard – will be wired to Firestore later
import { getInitials } from "@/utils/helper";
import { StarDisplay } from "@/utils/feedbackUtils";

const STATS = [
  { icon: "📁", label: "Total Projects",  value: "6",   iconClass: "icon-primary" },
  { icon: "💬", label: "Total Feedbacks", value: "100", iconClass: "icon-success" },
  { icon: "⭐", label: "Average Rating",  value: "4.4", iconClass: "icon-warning" },
];

const FEEDBACKS = [
  { id: "fb-001", project: "Designify UI Kit",   user: "Priya Sharma",  rating: 5, message: "Absolutely love the UI kit! Saved our team weeks of work.",                       date: "20 Jun 2026" },
  { id: "fb-002", project: "AuthGuard SDK",       user: "Arjun Kapoor",  rating: 5, message: "Best auth SDK I have used. The magic link flow is flawless.",                    date: "19 Jun 2026" },
  { id: "fb-003", project: "Designify UI Kit",   user: "Rahul Mehta",   rating: 4, message: "Great project. Would love more chart components and better dark mode support.",   date: "18 Jun 2026" },
  { id: "fb-004", project: "TaskFlow App",        user: "Neha Joshi",    rating: 4, message: "The Kanban board is intuitive. Real-time updates work perfectly across devices.",  date: "17 Jun 2026" },
  { id: "fb-005", project: "ShopLens Analytics",  user: "Vikram Singh",  rating: 4, message: "Conversion funnel charts are really insightful. The setup docs could be clearer.", date: "16 Jun 2026" },
  { id: "fb-006", project: "AuthGuard SDK",       user: "Divya Rao",     rating: 5, message: "2-FA integration was a breeze. The documentation is excellent.",                  date: "15 Jun 2026" },
  { id: "fb-007", project: "NotifyPulse",         user: "Karan Malhotra",rating: 4, message: "Push notifications work great. Email delivery is sometimes delayed by a minute.", date: "14 Jun 2026" },
  { id: "fb-008", project: "DataMesh API",        user: "Anjali Desai",  rating: 5, message: "Unified GraphQL endpoint saved so much backend complexity in our microservices.", date: "13 Jun 2026" },
  { id: "fb-009", project: "ShopLens Analytics",  user: "Rohan Gupta",   rating: 3, message: "Good idea but the onboarding flow needs work. Took me a while to set up tracking.", date: "12 Jun 2026" },
  { id: "fb-010", project: "TaskFlow App",        user: "Simran Kaur",   rating: 5, message: "Switched our whole team from Trello. The UX is so much cleaner and faster.",      date: "11 Jun 2026" },
];


function ratingBadgeClass(rating: number) {
  if (rating >= 5) return "fb-badge-success";
  if (rating >= 4) return "fb-badge-primary";
  return "fb-badge-warning";
}

export default function DashboardPage() {
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
            {STATS.map((stat) => (
              <div key={stat.label} className="col-12 col-sm-4">
                <div className="fb-stat-card">
                  <div className={`fb-stat-icon ${stat.iconClass}`}>{stat.icon}</div>
                  <div className="fb-stat-value">{stat.value}</div>
                  <div className="fb-stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Feedback Table ── */}
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <div>
              <h2 className="fb-section-title mb-0">All Feedback</h2>
              <p  className="fb-section-subtitle mb-0">{FEEDBACKS.length} responses across all projects</p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <select
                className="fb-input"
                style={{ width: "auto", padding: "0.35rem 0.75rem" }}
                defaultValue=""
              >
                <option value="">All Projects</option>
                <option>Designify UI Kit</option>
                <option>AuthGuard SDK</option>
                <option>TaskFlow App</option>
                <option>ShopLens Analytics</option>
                <option>NotifyPulse</option>
                <option>DataMesh API</option>
              </select>
              <select
                className="fb-input"
                style={{ width: "auto", padding: "0.35rem 0.75rem" }}
                defaultValue=""
              >
                <option value="">All Ratings</option>
                <option>5 Stars</option>
                <option>4 Stars</option>
                <option>3 Stars</option>
                <option>2 Stars</option>
                <option>1 Star</option>
              </select>
            </div>
          </div>

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
                {FEEDBACKS.map((fb) => (
                  <tr key={fb.id}>

                    {/* User */}
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="fb-avatar" style={{ width: 30, height: 30, fontSize: "0.7rem" }}>
                          {getInitials(fb.user)}
                        </div>
                        <span style={{ fontWeight: 500, whiteSpace: "nowrap" }}>{fb.user}</span>
                      </div>
                    </td>

                    {/* Project */}
                    <td>
                      <span className="fb-badge fb-badge-gray">{fb.project}</span>
                    </td>

                    {/* Rating */}
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <StarDisplay rating={fb.rating} />
                        <span className={`fb-badge ${ratingBadgeClass(fb.rating)}`}>{fb.rating}</span>
                      </div>
                    </td>

                    {/* Message */}
                    <td style={{ maxWidth: 340 }}>
                      <span style={{ color: "#374151", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {fb.message}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={{ whiteSpace: "nowrap", color: "#6B7280" }}>{fb.date}</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards (shown below md) */}
          <div className="d-flex flex-column gap-3 d-md-none">
            {FEEDBACKS.map((fb) => (
              <div key={fb.id} className="fb-feedback-card">

                <div className="fb-feedback-header">
                  <div className="fb-feedback-user">
                    <div className="fb-avatar">{getInitials(fb.user)}</div>
                    <div>
                      <div className="fb-feedback-name">{fb.user}</div>
                      <div className="fb-feedback-date">{fb.date}</div>
                    </div>
                  </div>
                  <StarDisplay rating={fb.rating} />
                </div>

                <span className="fb-badge fb-badge-gray mb-2 d-inline-block">{fb.project}</span>
                <p className="fb-feedback-msg">{fb.message}</p>

              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
