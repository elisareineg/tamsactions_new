import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase"; // Import Firebase auth and Firestore
import { doc, getDoc } from "firebase/firestore";
import "./DashboardPage.css";

interface DashboardPageProps {
  onExit: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onExit }) => {
  const navigate = useNavigate();
  const [tamBalance, setTamBalance] = useState(200);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setTamBalance(userDoc.data().tamBalance);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSellTam = () => {
    navigate("/sell-tam");
  };

  const handlePurchaseTam = () => {
    navigate("/purchase-tam");
  };

  return (
    <div className="dashboard-page">
      <button className="exit-button" onClick={onExit}>
        EXIT
      </button>
      <div className="dashboard-card">
        <h1>HOME</h1>
        <p className="tam-balance">TAM BALANCE: {tamBalance}</p>
        <div className="dashboard-buttons">
          <button className="dashboard-button" onClick={handleSellTam}>
            SELL TAM
          </button>
          <button className="dashboard-button" onClick={handlePurchaseTam}>
            PURCHASE TAM
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;