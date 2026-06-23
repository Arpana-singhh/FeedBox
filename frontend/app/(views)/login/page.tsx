export default function LoginPage() {
  return (
    <div className="fb-auth-wrapper">
      <div className="fb-auth-card">

        {/* Brand */}
        <div className="fb-auth-brand">
          <a href="/" className="fb-brand">Feed<span>Box</span></a>
          <p className="fb-auth-tagline">Sign in to your account</p>
        </div>

        {/* Form */}
        <form className="fb-auth-form">

          <div className="fb-form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              className="fb-input"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="fb-form-group">
            <div className="fb-auth-label-row">
              <label htmlFor="password">Password</label>
              <a href="/forgot-password" className="fb-auth-forgot">Forgot password?</a>
            </div>
            <input
              id="password"
              type="password"
              className="fb-input"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="fb-btn fb-btn-primary fb-btn-lg w-100 mt-2">
            Sign In
          </button>

        </form>

        {/* Divider */}
        <div className="fb-auth-divider">
          <span>or continue with</span>
        </div>

        {/* Google OAuth */}
        <button type="button" className="fb-btn fb-btn-ghost fb-btn-lg w-100">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Footer */}
        <p className="fb-auth-footer">
          Don&apos;t have an account?{" "}
          <a href="/register">Register</a>
        </p>

      </div>
    </div>
  );
}
