import React from "react";
import "../css/Login.css";
import { Link } from "react-router-dom";

const LoginPage = () => {
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
        <h2>Welcome</h2>
        <div className="input-container">
          <input type="text" placeholder="Username" className="input-field" />
          <input type="password" placeholder="Password" className="input-field" />
          <button className="login-button">Login</button>
          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot your password?</a>
          </div>
          <p className="signup-text">
            Not a member? <Link to="/signup">Sign up now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
