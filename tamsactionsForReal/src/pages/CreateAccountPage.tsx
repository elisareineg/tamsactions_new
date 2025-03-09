import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import "./CreateAccountPage.css"; // Import the CSS file

// Define the props for the CreateAccountPage component
interface CreateAccountPageProps {
  onAccountCreated: () => void; // Callback for successful account creation
}

const CreateAccountPage: React.FC<CreateAccountPageProps> = ({ onAccountCreated }) => {
  const navigate = useNavigate(); // Hook for navigation

  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Regex for validation
  const regexEmail = /@queensu.ca$/; // Validate Queen's email
  const regexPassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/; // Validate password

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Queen's email
    if (!regexEmail.test(email)) {
      alert("Please use a valid Queen's University email.");
      return;
    }

    // Validate password
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
    onAccountCreated(); // Notify parent component that account was created
    navigate("/dashboard"); // Redirect to the dashboard
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate("/"); // Go back to the login page
  };

  return (
    <div className="create-account-page">
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <h2>Queen's Email</h2>
        <input
          className="input-field"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your Queen's email"
          required
        />
        <br />
        <h2>Password</h2>
        <input
          className="input-field"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <br />
        <h2>Confirm Password</h2>
        <input
          className="input-field"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccountPage;