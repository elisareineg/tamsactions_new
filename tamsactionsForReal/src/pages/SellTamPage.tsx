import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import "./SellTamPage.css";

const SellTamPage: React.FC = () => {
  const navigate = useNavigate();
  const [tamAmount, setTamAmount] = useState<string>("");
  const [pricePerTam, setPricePerTam] = useState<string>("");
  const tamBalance = parseInt(localStorage.getItem("tamBalance") || "200");

  const calculateTotalPrice = () => {
    const amount = parseFloat(tamAmount) || 0;
    const price = parseFloat(pricePerTam) || 0;
    return amount * price;
  };

  const validateListing = () => {
    const amount = parseFloat(tamAmount);
    const price = parseFloat(pricePerTam);

    if (!amount || amount <= 0) {
      alert("Please enter a valid number of TAMs to sell.");
      return false;
    }
    if (amount > tamBalance) {
      alert("You do not have enough TAMs to sell.");
      return false;
    }
    if (!price || price <= 0) {
      alert("Please enter a valid price per TAM.");
      return false;
    }
    if (price > 7.5) {
      alert("Price per TAM cannot exceed $7.50.");
      return false;
    }
    const totalPrice = calculateTotalPrice();
    if (totalPrice > amount * 7.5) {
      alert("Total price exceeds the maximum allowed ($7.50 per TAM).");
      return false;
    }
    return true;
  };

  const handlePostListing = async () => {
    if (!validateListing()) return;

    try {
      // Check if user is authenticated
      if (!auth.currentUser) {
        console.error("No authenticated user found");
        alert("You must be signed in to post a listing. Please sign in again.");
        navigate("/");
        return;
      }

      console.log("Current user:", auth.currentUser);
      console.log("User email:", auth.currentUser.email);

      // Check if user email exists
      if (!auth.currentUser.email) {
        console.error("No email found for authenticated user");
        alert("User email not found. Please sign in again.");
        navigate("/");
        return;
      }

      // Check if user document exists in Firestore
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      console.log("Checking user document for UID:", auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      console.log("User document exists:", userDoc.exists());
      console.log("User document data:", userDoc.data());

      if (!userDoc.exists()) {
        console.log("Creating new user document...");
        // Create user document if it doesn't exist
        await setDoc(userDocRef, {
          email: auth.currentUser.email,
          createdAt: new Date().toISOString(),
          tamBalance: 200,
        });
        console.log("User document created successfully");
      }

      // Create the listing document
      const listingData = {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        tamAmount: parseFloat(tamAmount),
        pricePerTam: parseFloat(pricePerTam),
        totalPrice: calculateTotalPrice(),
        createdAt: new Date(),
        status: "active",
      };

      console.log("Attempting to post listing:", listingData);

      try {
        // Add the document to Firestore
        const docRef = await addDoc(collection(db, "listings"), listingData);
        console.log("Listing posted successfully with ID:", docRef.id);

        // Update local TAM balance
        const newBalance = tamBalance - parseFloat(tamAmount);
        localStorage.setItem("tamBalance", newBalance.toString());

        alert("Listing posted successfully!");
        navigate("/dashboard");
      } catch (firestoreError: any) {
        console.error("Firestore error details:", {
          code: firestoreError.code,
          message: firestoreError.message,
          stack: firestoreError.stack,
        });
        throw firestoreError;
      }
    } catch (error: any) {
      console.error("Error posting listing:", {
        code: error.code,
        message: error.message,
        stack: error.stack,
      });

      // Provide more specific error messages
      let errorMessage = "Failed to post listing. ";
      if (error.code === "permission-denied") {
        errorMessage += "You don't have permission to post listings.";
      } else if (error.code === "not-found") {
        errorMessage += "The listings collection doesn't exist.";
      } else if (error.code === "unavailable") {
        errorMessage +=
          "The service is currently unavailable. Please try again later.";
      } else {
        errorMessage += `Error: ${error.message}. Please try again or contact support if the issue persists.`;
      }

      alert(errorMessage);
    }
  };

  return (
    <div className="sell-tam-container">
      <div className="background-utensils">
        <span className="fork">🍴</span>
        <span className="knife">🔪</span>
      </div>
      <nav className="page-nav">
        <h1>Sell TAMs</h1>
        <button
          className="go-back-button"
          onClick={() => navigate("/dashboard")}
        >
          Go Back
        </button>
      </nav>

      <main className="sell-tam-content">
        <div className="sell-tam-card">
          <div className="balance-info">
            <h3>Available Balance</h3>
            <div className="balance-amount">{tamBalance}</div>
            <p className="balance-label">TAMs</p>
          </div>

          <div className="form-group">
            <label htmlFor="tamAmount">Number of TAMs to sell</label>
            <input
              id="tamAmount"
              type="number"
              value={tamAmount}
              onChange={(e) => setTamAmount(e.target.value)}
              min="1"
              max={tamBalance}
              className="input-field"
              placeholder="Enter amount"
            />
          </div>

          <div className="form-group">
            <label htmlFor="pricePerTam">Price per TAM (max $7.50)</label>
            <input
              id="pricePerTam"
              type="number"
              value={pricePerTam}
              onChange={(e) => setPricePerTam(e.target.value)}
              min="0.01"
              max="7.50"
              step="0.01"
              className="input-field"
              placeholder="Enter price per TAM"
            />
          </div>

          <div className="price-summary">
            <div className="summary-item">
              <span>Total Price:</span>
              <span className="total-price">
                ${calculateTotalPrice().toFixed(2)}
              </span>
            </div>
            <div className="summary-item">
              <span>Price per TAM:</span>
              <span>${(parseFloat(pricePerTam) || 0).toFixed(2)}</span>
            </div>
          </div>

          <button className="submit-button" onClick={handlePostListing}>
            Post Listing
          </button>
        </div>
      </main>
    </div>
  );
};

export default SellTamPage;
