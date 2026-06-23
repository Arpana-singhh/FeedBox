export default function Navbar() {
  return (
    <nav className="fb-navbar sticky-top">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between">

          <a href="/" className="fb-brand">Feed<span>Box</span></a>

          <div className="d-flex align-items-center gap-3">
            <a href="/"          className="fb-nav-link">Projects</a>
            <a href="/dashboard" className="fb-nav-link">Dashboard</a>
            <a href="/feedback"  className="fb-btn fb-btn-primary fb-btn-sm">
              + New Feedback
            </a>
            <a href="/login" className="fb-btn fb-btn-outline fb-btn-sm">
              Login
            </a>
          </div>

        </div>
      </div>
    </nav>
  );
}
