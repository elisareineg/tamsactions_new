import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import "./Dashboard.css";

interface PurchaseRequest {
  id: string;
  tamAmount: number;
  pricePerTam: number;
  totalPrice: number;
  status: string;
  buyerEmail: string;
  sellerEmail: string;
  createdAt: Date;
  expiresAt?: Date;
  responseMessage?: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [notifications, setNotifications] = useState<PurchaseRequest[]>([]);
  const tamBalance = parseInt(localStorage.getItem("tamBalance") || "200");
  const pendingRequestsCount = requests.filter(
    (r) => r.status === "pending"
  ).length;
  const notificationCount = notifications.length;
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const [bannerType, setBannerType] = useState<"approved" | "rejected">(
    "approved"
  );

  useEffect(() => {
    fetchPurchaseRequests();
    fetchNotifications();
  }, []);

  useEffect(() => {
    // Show banner for the most recent notification
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      setBannerType(latestNotification.status as "approved" | "rejected");
      setBannerMessage(latestNotification.responseMessage || "");
      setShowBanner(true);

      // Hide banner after 5 seconds
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const fetchPurchaseRequests = async () => {
    if (!auth.currentUser) return;

    try {
      const q = query(
        collection(db, "listings"),
        where("status", "==", "pending"),
        where("userEmail", "==", auth.currentUser.email)
      );

      const querySnapshot = await getDocs(q);
      const requestsData: PurchaseRequest[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        requestsData.push({
          id: doc.id,
          tamAmount: data.tamAmount,
          pricePerTam: data.pricePerTam,
          totalPrice: data.totalPrice,
          status: data.status,
          buyerEmail: data.buyerEmail,
          sellerEmail: data.userEmail,
          createdAt: data.createdAt.toDate(),
          expiresAt: data.expiresAt?.toDate(),
        });
      });

      setRequests(requestsData);
    } catch (error) {
      console.error("Error fetching purchase requests:", error);
    }
  };

  const fetchNotifications = async () => {
    if (!auth.currentUser) return;

    try {
      // Fetch listings where the current user is the buyer and status is either approved or rejected
      const q = query(
        collection(db, "listings"),
        where("buyerEmail", "==", auth.currentUser.email),
        where("status", "in", ["approved", "rejected"])
      );

      const querySnapshot = await getDocs(q);
      const notificationsData: PurchaseRequest[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Only include notifications from the last 24 hours
        const createdAt = data.createdAt.toDate();
        const now = new Date();
        const hoursDiff =
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

        if (hoursDiff <= 24) {
          notificationsData.push({
            id: doc.id,
            tamAmount: data.tamAmount,
            pricePerTam: data.pricePerTam,
            totalPrice: data.totalPrice,
            status: data.status,
            buyerEmail: data.buyerEmail,
            sellerEmail: data.userEmail,
            createdAt: createdAt,
            responseMessage: data.responseMessage,
          });
        }
      });

      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await updateDoc(doc(db, "listings", requestId), {
        status: "approved",
        responseMessage:
          "Your purchase request has been approved! Please complete the transaction within 24 hours.",
        expiresAt: Timestamp.fromDate(expiresAt),
      });
      fetchPurchaseRequests();
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Failed to approve request. Please try again.");
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await updateDoc(doc(db, "listings", requestId), {
        status: "rejected",
        responseMessage: "Your purchase request has been rejected.",
      });
      fetchPurchaseRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request. Please try again.");
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const scrollToRequests = () => {
    const requestsSection = document.querySelector(".requests-section");
    requestsSection?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleNotifications = () => {
    const notificationsPanel = document.querySelector(".notifications-panel");
    notificationsPanel?.classList.toggle("show");
  };

  const handleNavigateToCheckout = (notification: PurchaseRequest) => {
    navigate("/checkout", {
      state: {
        listingId: notification.id,
        tamAmount: notification.tamAmount,
        pricePerTam: notification.pricePerTam,
        totalPrice: notification.totalPrice,
        sellerEmail: notification.sellerEmail,
      },
    });
  };

  return (
    <div className="page-container">
      <button className="sign-out-button" onClick={handleSignOut}>
        Sign Out
      </button>

      {showBanner && (
        <div className={`notification-banner ${bannerType}`}>
          <div className="banner-content">
            <span className="banner-icon">
              {bannerType === "approved" ? "✅" : "❌"}
            </span>
            <span className="banner-message">{bannerMessage}</span>
          </div>
          <button className="banner-close" onClick={() => setShowBanner(false)}>
            ×
          </button>
        </div>
      )}

      <div className="background-utensils">
        <span className="fork">🍴</span>
        <span className="knife">🔪</span>
      </div>

      <nav className="dashboard-nav">
        <div className="nav-left">
          <div className="nav-actions">
            <div className="notifications-wrapper">
              <button
                className="notifications-button"
                onClick={toggleNotifications}
              >
                📬
                {notificationCount > 0 && (
                  <span className="notifications-badge">
                    {notificationCount}
                  </span>
                )}
              </button>
              <div className="notifications-panel">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${notification.status}`}
                    >
                      <div className="notification-header">
                        <span className="notification-status">
                          {notification.status === "approved"
                            ? "✅ Approved"
                            : "❌ Rejected"}
                        </span>
                        <span className="notification-time">
                          {new Date(
                            notification.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="notification-details">
                        <p>
                          {notification.tamAmount} TAMs for $
                          {notification.totalPrice.toFixed(2)}
                        </p>
                        <p className="notification-message">
                          {notification.responseMessage}
                        </p>
                        {notification.status === "approved" && (
                          <>
                            <p className="expiry-message">
                              Expires:{" "}
                              {new Date(
                                notification.expiresAt!
                              ).toLocaleString()}
                            </p>
                            <button
                              className="purchase-button"
                              onClick={() =>
                                handleNavigateToCheckout(notification)
                              }
                            >
                              Purchase Now
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-notifications">No new notifications</div>
                )}
              </div>
            </div>
            {pendingRequestsCount > 0 && (
              <div className="requests-link" onClick={scrollToRequests}>
                <span>Purchase Requests</span>
                <span className="requests-badge">{pendingRequestsCount}</span>
              </div>
            )}
          </div>
        </div>
        <div className="nav-center">
          <div className="nav-brand">TAMSACTIONS</div>
        </div>
        <div className="nav-right"></div>
      </nav>

      <main className="dashboard-content">
        <div className="dashboard-grid">
          <div className="balance-card">
            <h2>Your Meal Balance</h2>
            <div className="balance-amount">{tamBalance}</div>
            <p className="balance-label">Available TAMS</p>
          </div>

          <div className="action-cards">
            <div className="action-card card" onClick={() => navigate("/sell")}>
              <div className="action-icon">💰</div>
              <h3>Sell Meals</h3>
              <p>List your extra TAMS for other students to purchase</p>
            </div>

            <div
              className="action-card card"
              onClick={() => navigate("/purchase")}
            >
              <div className="action-icon">🍽️</div>
              <h3>Buy Meals</h3>
              <p>Browse and purchase available TAMS from fellow students</p>
            </div>
          </div>

          <section className="requests-section">
            <div className="requests-header">
              <h2>Purchase Requests</h2>
            </div>
            <div className="requests-grid">
              {requests.length === 0 ? (
                <div className="empty-state">
                  <p>No pending purchase requests</p>
                </div>
              ) : (
                requests.map((request) => (
                  <div key={request.id} className="request-card">
                    <div className="request-header">
                      <div className="request-buyer">
                        <div className="request-detail-label">From</div>
                        <div className="request-detail-value">
                          {request.buyerEmail}
                        </div>
                      </div>
                      <div
                        className={`request-status status-${request.status}`}
                      >
                        {request.status}
                      </div>
                    </div>
                    <div className="request-details">
                      <div className="request-detail-item">
                        <span>Amount:</span>
                        <span>{request.tamAmount} TAMs</span>
                      </div>
                      <div className="request-detail-item">
                        <span>Price per TAM:</span>
                        <span>${request.pricePerTam.toFixed(2)}</span>
                      </div>
                      <div className="request-detail-item">
                        <span>Total Price:</span>
                        <span>${request.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="request-actions">
                      <button
                        className="request-button approve-button"
                        onClick={() => handleApproveRequest(request.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="request-button reject-button"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
