import React from "react";
import "./DashboardPage.css"; // Import the CSS file

// Define the props for the DashboardPage component
interface DashboardPageProps {
  onExit: () => void; // onExit is a function that takes no arguments and returns void
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onExit }) => {
  return (
    <div className="dashboard-page">
      {/* EXIT button at the top right corner */}
      <button className="exit-button" onClick={onExit}>
        EXIT
      </button>

      {/* Centered content */}
      <div className="dashboard-content">
        <h1>HOME</h1>
        <p className="tam-balance">TAM BALANCE: </p>
        <div className="dashboard-buttons">
          <button className="dashboard-button">SELL TAM</button>
          <button className="dashboard-button">PURCHASE TAM</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;