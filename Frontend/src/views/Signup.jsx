import React from "react";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  return (
    <div className="container">
      <div className="login-box">
        <div className="avatar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5.121 17.804A12.073 12.073 0 0112 15c2.67 0 5.162.839 7.121 2.304M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <h2>Sign Up</h2>
        <div className="input-container">
          <input type="text" placeholder="Username" className="input-field" />
          <input type="email" placeholder="Email" className="input-field" />
          <input type="password" placeholder="Password" className="input-field" />
          <input type="password" placeholder="Confirm Password" className="input-field" />
          <button className="login-button">Sign Up</button>
          <p className="signup-text">
            Already have an account? <Link to="/">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
