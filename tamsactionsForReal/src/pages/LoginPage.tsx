import React, { useState } from "react";
import { signInWithMicrosoft, signInWithGoogle } from "../firebase";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (provider: "microsoft" | "google") => {
    try {
      setIsLoading(true);
      setError(null);
      if (provider === "microsoft") {
        await signInWithMicrosoft();
      } else {
        await signInWithGoogle();
      }
    } catch (error: any) {
      setError(error.userMessage || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="background-utensils">
        <span className="fork">&#9135;</span>
        <span className="knife">&#9986;</span>
      </div>
      <div className="queens-logo">
        <div className="queens-text">Queen's University</div>
      </div>
      <div className="login-card">
        <div className="login-header">
          <h1>TAMSACTIONS</h1>
          <p className="subtitle">
            The Meal Marketplace for Queen's University Students
          </p>
        </div>
        <div className="login-content">
          <button
            className="microsoft-button"
            onClick={() => handleSignIn("microsoft")}
            disabled={isLoading}
          >
            <div className="microsoft-icon">
              <div></div>
            </div>
            {isLoading ? "Signing in..." : "Sign in with Microsoft"}
          </button>
          <div className="divider">
            <span>or</span>
          </div>
          <button
            className="google-button"
            onClick={() => handleSignIn("google")}
            disabled={isLoading}
          >
            <div className="google-icon"></div>
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </button>
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
