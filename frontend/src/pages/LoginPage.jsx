import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  if (isAuthenticated) return <Navigate to="/students" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const ok = await login(username, password);
    if (!ok) setError("Invalid username or password.");
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-seal">SMS</div>
        <h1 className="login-title">Transcript Console</h1>
        <p className="login-sub">Sign in to open the student ledger.</p>

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span className="field-label">Username</span>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="field">
            <span className="field-label">Password</span>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="login-hint">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
        <p className="login-hint">
          Default credentials: <code>crni99</code> / <code>student</code>
        </p>
      </div>
    </div>
  );
}
