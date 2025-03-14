import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import "./PurchaseTamPage.css";

interface Listing {
  id: string;
  userEmail: string;
  userId: string;
  tamAmount: number;
  pricePerTam: number;
  totalPrice: number;
  status: string;
}

const PurchaseTamPage: React.FC = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const q = query(
        collection(db, "listings"),
        where("status", "==", "active")
      );

      const querySnapshot = await getDocs(q);
      const listingsData: Listing[] = [];

      querySnapshot.forEach((doc) => {
        listingsData.push({
          id: doc.id,
          ...(doc.data() as Omit<Listing, "id">),
        });
      });

      setListings(listingsData);
    } catch (error) {
      console.error("Error fetching listings:", error);
      alert("Failed to load listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPurchase = async (listing: Listing) => {
    if (!auth.currentUser) {
      alert("You must be signed in to request a purchase.");
      return;
    }

    if (auth.currentUser.email === listing.userEmail) {
      alert("You cannot purchase your own listing.");
      return;
    }

    try {
      await updateDoc(doc(db, "listings", listing.id), {
        status: "pending",
        buyerId: auth.currentUser.uid,
        buyerEmail: auth.currentUser.email,
      });

      alert(`Purchase request sent for ${listing.tamAmount} TAMs!`);
      fetchListings();
    } catch (error) {
      console.error("Error requesting purchase:", error);
      alert("Failed to request purchase. Please try again.");
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!auth.currentUser) {
      alert("You must be signed in to delete a listing.");
      return;
    }

    try {
      await deleteDoc(doc(db, "listings", listingId));
      alert("Listing deleted successfully!");
      fetchListings();
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("Failed to delete listing. Please try again.");
    }
  };

  return (
    <div className="purchase-tam-container">
      <div className="background-utensils">
        <span className="fork">🍴</span>
        <span className="knife">🔪</span>
      </div>
      <nav className="page-nav">
        <h1>Purchase TAMs</h1>
        <button
          className="go-back-button"
          onClick={() => navigate("/dashboard")}
        >
          Go Back
        </button>
      </nav>

      <main className="purchase-tam-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3>No Listings Available</h3>
            <p>Check back later for new TAM listings</p>
          </div>
        ) : (
          <div className="listings-table">
            <table>
              <thead>
                <tr>
                  <th>Seller</th>
                  <th>Amount</th>
                  <th>Price per TAM</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id}>
                    <td>{listing.userEmail}</td>
                    <td>{listing.tamAmount} TAMs</td>
                    <td>${listing.pricePerTam.toFixed(2)}</td>
                    <td>${listing.totalPrice.toFixed(2)}</td>
                    <td>
                      <div className="listing-status">Available</div>
                    </td>
                    <td>
                      <div className="table-actions">
                        {auth.currentUser?.email === listing.userEmail ? (
                          <button
                            className="table-button delete"
                            onClick={() => handleDeleteListing(listing.id)}
                          >
                            Delete
                          </button>
                        ) : (
                          <button
                            className="table-button purchase"
                            onClick={() => handleRequestPurchase(listing)}
                          >
                            Request
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default PurchaseTamPage;
