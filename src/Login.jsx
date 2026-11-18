import { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password.");
      return;
    }

    onLogin(email);
  }

  return (
    <div className="login-page">
      <div className="login-art">
        <div className="login-logo">E</div>
        <p className="login-tag">YOUR FUTURE STARTS HERE</p>
        <h1>Learn smarter.<br />Perform better.</h1>
        <p className="art-description">
          Your exams, results and learning journey — all in one place.
        </p>
        <div className="art-circle circle-one"></div>
        <div className="art-circle circle-two"></div>
        <div className="art-decoration">✦</div>
      </div>

      <div className="login-form-side">
        <div className="login-form-wrap">
          <div className="mobile-logo">E <span>ExamFlow</span></div>
          <p className="form-eyebrow">WELCOME BACK</p>
          <h2>Student Login</h2>
          <p className="form-subtitle">
            Enter your details to access your dashboard.
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="login-submit" type="submit">
              Login to Dashboard <span>→</span>
            </button>
          </form>

          <p className="login-note">
            Demo project · Authentication will be connected later.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;