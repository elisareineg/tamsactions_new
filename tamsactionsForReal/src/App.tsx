import React from "react";
import { useState } from "react";
import "./App.css";
import DashboardPage from "./pages/DashboardPage"; // Import the DashboardPage

function App() {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showCreateAccountForm, setShowCreateAccountForm] = useState(false); // Track Create Account form visibility
  const [isSignedIn, setIsSignedIn] = useState(false); // Track sign-in status
  const regexEmail = /@queensu.ca/;

  const handleSignIn = () => {
    if (regexEmail.test(login.email)) {
      console.log("Signed in successfully");
      setIsSignedIn(true); // Set signed-in state to true
    } else {
      console.log("Email not from Queen's University");
      alert("Please use a valid Queen's University email.");
    }
  };

  const handleExit = () => {
    setIsSignedIn(false); // Go back to the login screen
  };

  const handleCreateAccount = () => {
    setShowCreateAccountForm(true); // Show the Create Account form
  };

  const handleCancelCreateAccount = () => {
    setShowCreateAccountForm(false); // Go back to the login page
  };

  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const email = (e.target as any).email.value;
    const password = (e.target as any).password.value;
    const confirmPassword = (e.target as any).confirmPassword.value;

    // Validate Queen's email
    if (!regexEmail.test(email)) {
      alert("Please use a valid Queen's University email.");
      return;
    }

    // Validate password
    const regexPassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/; // At least 8 chars, 1 uppercase, 1 symbol
    if (!regexPassword.test(password)) {
      alert(
        "Password must be at least 8 characters long, contain one uppercase letter, and one symbol."
      );
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // If all validations pass, create the account and go to the dashboard
    console.log("Account created successfully");
    setIsSignedIn(true); // Redirect to the dashboard
  };

  return (
    <div className="card">
      {isSignedIn ? (
        // Render the DashboardPage if signed in
        <DashboardPage onExit={handleExit} />
      ) : showCreateAccountForm ? (
        // Render the Create Account form if "Create Account" is clicked
        <form onSubmit={handleCreateAccountSubmit}>
          <h1>Create Account</h1>
          <h2>Queen's Email</h2>
          <input
            className="input-field"
            type="email"
            name="email"
            placeholder="Enter your Queen's email"
            required
          />
          <br />
          <h2>Password</h2>
          <input
            className="input-field"
            type="password"
            name="password"
            placeholder="Enter your password"
            required
          />
          <br />
          <h2>Confirm Password</h2>
          <input
            className="input-field"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            required
          />
          <br />
          <br />
          <div className="button-container">
            <button type="submit" className="auth-button">
              Create Account
            </button>
            <button
              type="button"
              className="auth-button"
              onClick={handleCancelCreateAccount}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="icon-container">
            <i className="fas fa-utensils fa-3x"></i>{" "}
            {/* Fork and knife icon */}
          </div>
          {!showLoginForm ? (
            // Render the main page with Sign In and Create Account buttons
            <>
              <h1 className="title">TAMSACTIONS</h1>
              <div className="button-container">
                <button
                  className="auth-button"
                  onClick={() => setShowLoginForm(true)}
                >
                  Sign In
                </button>
                <button className="auth-button" onClick={handleCreateAccount}>
                  Create Account
                </button>
              </div>
            </>
          ) : (
            // Render the login form if "Sign In" is clicked
            <>
              <h2>Queen's Email</h2>
              <input
                className="input-field"
                value={login.email}
                onChange={(e) =>
                  setLogin({
                    ...login,
                    email: e.target.value,
                  })
                }
              />
              <br />
              <h2>Password</h2>
              <input
                className="input-field"
                type="password"
                value={login.password}
                onChange={(e) =>
                  setLogin({
                    ...login,
                    password: e.target.value,
                  })
                }
              />
              <br />
              <br />
              <button className="auth-button" onClick={handleSignIn}>
                Log In
              </button>
              <br />
              <br />
              <button
                className="auth-button"
                onClick={() => setShowLoginForm(false)}
              >
                Go Back
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
