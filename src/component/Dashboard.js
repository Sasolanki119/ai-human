import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "../style/Dashboard.css";

const Dashboard = () => {
  const [roundStatus, setRoundStatus] = useState(null); // Changed to null for better checks
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  // Fetch user document using UID
  const getUserDocRef = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No logged-in user!");
      return null;
    }
    return doc(db, "users", user.uid);
  };

  // Fetch roundStatus from Firestore when component loads
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
    } else {
      const fetchRounds = async () => {
        setLoading(true); // Start loading
        const userDocRef = await getUserDocRef();
        if (!userDocRef) {
          console.error("User document not found!");
          setLoading(false);
          return;
        }

        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            console.log("Fetched roundStatus:", userData.roundStatus); // Debugging line

            setRoundStatus(userData.roundStatus || {});
          } else {
            console.error("User data not found!");
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
        }
        setLoading(false); // Stop loading
      };

      fetchRounds();
    }
  }, [navigate, db, auth]);

  // Updates round status and navigates to the respective round
  const handleNavigation = async (roundKey) => {
    if (!roundStatus || !roundStatus[roundKey]) return;

    navigate(`/round${roundStatus[roundKey].round}`);
  };

  // Logout and clear session
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to Your Dashboard</h1>
      <h2>Round Progress</h2>

      {/* Show loading spinner or message */}
      {loading ? (
        <p>Loading rounds...</p>
      ) : roundStatus && Object.keys(roundStatus).length > 0 ? (
        <ul>
          {Object.keys(roundStatus).map((roundKey) => (
            <li
              key={roundKey}
              className={`round ${roundStatus[roundKey].status.toLowerCase()}`}
              onClick={() => handleNavigation(roundKey)}
              style={{
                cursor: roundStatus[roundKey].status !== "Locked" ? "pointer" : "not-allowed",
                opacity: roundStatus[roundKey].status === "Locked" ? 0.5 : 1,
              }}
            >
              {roundStatus[roundKey].name} - <strong>{roundStatus[roundKey].status}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p>No rounds found. Please check your Firestore setup.</p>
      )}

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
