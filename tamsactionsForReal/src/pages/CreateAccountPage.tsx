import React from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, signInWithMicrosoft } from "../../firebase";
import "./CreateAccountPage.css";

interface CreateAccountPageProps {
  onAccountCreated: () => void;
}

const CreateAccountPage: React.FC<CreateAccountPageProps> = ({
  onAccountCreated,
}) => {
  const navigate = useNavigate();

  const handleMicrosoftSignIn = async () => {
    try {
      const result = await signInWithMicrosoft();
      const user = result.user;

      // Check if the email is a Queen's University email
      if (!user.email?.endsWith("@queensu.ca")) {
        await auth.signOut();
        alert("Please use a Queen's University email address.");
        return;
      }

      // Store user data in Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          createdAt: new Date().toISOString(),
          tamBalance: 200, // Initial TAM balance
        },
        { merge: true }
      ); // Use merge to avoid overwriting existing data

      onAccountCreated();
      navigate("/dashboard");
      alert("Successfully signed in!");
    } catch (error) {
      console.error("Error signing in with Microsoft:", error);
      alert("Failed to sign in. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="create-account-page">
      <h1>Sign In with Microsoft</h1>
      <div className="auth-container">
        <p>Please use your Queen's University Microsoft account to sign in.</p>
        <button
          className="microsoft-auth-button"
          onClick={handleMicrosoftSignIn}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png"
            alt="Microsoft logo"
            className="microsoft-logo"
          />
          Sign in with Microsoft
        </button>
        <button className="cancel-button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateAccountPage;
