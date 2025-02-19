import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import "../style/Round1.css";

const Round1 = () => {
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState("");
  const [customMovie, setCustomMovie] = useState("");
  const [story, setStory] = useState("");
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertShown, setAlertShown] = useState(false);
  const [oneMinuteAlertShown, setOneMinuteAlertShown] = useState(false);

  const movies = ["Inception", "Titanic", "The Matrix", "Interstellar", "Other"];

  useEffect(() => {
    if (!alertShown) {
      alert("Round 1 has started! You have 15 minutes.");
      setAlertShown(true);
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 60 && !oneMinuteAlertShown) {
          alert("1 minute remaining! Submit your response soon.");
          setOneMinuteAlertShown(true);
        }
        if (prevTime <= 1) {
          clearInterval(timer);
          setSubmitDisabled(true);
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [alertShown, oneMinuteAlertShown]);

  const openChatGPTAndRedirect = () => {
    const newTab = window.open("https://www.google.co.in/", "_blank");

    if (newTab) {
      setTimeout(() => {
        newTab.close();
        navigate("/round1"); // Redirect to main page after closing
      }, 5000); // 10 seconds
    }
  };

  const handleSubmit = async () => {
    if (!selectedMovie || (selectedMovie === "Other" && !customMovie) || !story) {
      alert("Please complete all fields before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("No user is logged in.");
        setIsSubmitting(false);
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        alert("User document not found!");
        setIsSubmitting(false);
        return;
      }

      await updateDoc(userDocRef, {
        "response.round1": {
          movie: selectedMovie === "Other" ? customMovie : selectedMovie,
          story: story,
        },
        "roundStatus.1.status": "Completed",
        "roundStatus.2.status": "Pending",
      });

      alert("Your response has been submitted successfully!");
      navigate("/dashboard"); 
      // openChatGPTAndRedirect(); // Open ChatGPT after submission
    } catch (error) {
      console.error("Error updating Firestore document:", error);
      alert("There was an error submitting your response.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="round1-container">
      <h1>Round 1: Reel to Real</h1>
      <p className="description">
        Rewrite the plot of a movie by changing key decisions. Choose a movie from the list or add your own.
      </p>

      <div className="movie-selection">
        <label>Select a Movie:</label>
        <select value={selectedMovie} onChange={(e) => setSelectedMovie(e.target.value)}>
          <option value="">-- Select a Movie --</option>
          {movies.map((movie, index) => (
            <option key={index} value={movie}>{movie}</option>
          ))}
        </select>
        {selectedMovie === "Other" && (
          <input
            type="text"
            placeholder="Enter movie name"
            value={customMovie}
            onChange={(e) => setCustomMovie(e.target.value)}
          />
        )}
      </div>

      <div className="story-writing">
        <label>Rewrite the Movie Plot:</label>
        <textarea
          rows="8"
          placeholder="Write your revised movie story here..."
          value={story}
          onChange={(e) => setStory(e.target.value)}
        ></textarea>
      </div>

      <p className="timer">
        Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
      </p>

      {/* Open ChatGPT Button */}
      <button className="open-url-button" onClick={openChatGPTAndRedirect}>
        Open ChatGPT
      </button>

      {/* Submit Button */}
      <button className="submit-button" onClick={handleSubmit} disabled={submitDisabled || isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default Round1;
