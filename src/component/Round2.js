import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import "../style/Round2.css";

const Round2 = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("");
  const [productName, setProductName] = useState("");
  const [productDetails, setProductDetails] = useState({
    description: "",
    marketing: "",
    growth: "",
    audience: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isChatGPTOpened, setIsChatGPTOpened] = useState(false);
  const themes = ["Sustainability", "Health & Wellness", "AI & Automation", "Education & E-Learning"];

  useEffect(() => {
    alert("Round 2 has started! Please submit before the time ends.");
  }, []);

  const handleSubmit = async () => {
    if (!theme || !productName.trim() || Object.values(productDetails).some((v) => !v.trim())) {
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
        "response.round2": { theme, productName, productDetails },
        "roundStatus.2.status": "Completed",
        "roundStatus.3.status": "Pending",
      });

      alert("Your response has been submitted successfully!");
      setIsSubmitted(true);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating Firestore document:", error);
      alert("There was an error submitting your response.");
    }

    setIsSubmitting(false);
  };

  const openChatGPT = () => {
    if (!isChatGPTOpened) {
      const newTab = window.open("https://chat.openai.com/", "_blank");
      if (newTab) {
        setIsChatGPTOpened(true);
        setTimeout(() => {
          newTab.close();
          navigate("/round2");
        }, 5000);
      }
    }
  };

  return (
    <div className="round2-container">
      <h1>Round 2: Thematic Product Strategy Challenge</h1>
      <p className="description">Select a theme, enter your product name, and develop a product strategy.</p>

      <div className="product-info-container">
        <label>Select Theme:</label>
        <select onChange={(e) => setTheme(e.target.value)} value={theme} disabled={isSubmitted}>
          <option value="">-- Select Theme --</option>
          {themes.map((themeOption) => (
            <option key={themeOption} value={themeOption}>
              {themeOption}
            </option>
          ))}
        </select>

        <label>Enter Product Name:</label>
        <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} disabled={isSubmitted} />
      </div>

      <div className="strategy-container">
        {Object.keys(productDetails).map((key) => (
          <div className="strategy-box" key={key}>
            <h3>{key.charAt(0).toUpperCase() + key.slice(1)} Strategy</h3>
            <textarea
              value={productDetails[key]}
              onChange={(e) => setProductDetails({ ...productDetails, [key]: e.target.value })}
              placeholder={`Enter ${key} strategy...`}
              disabled={isSubmitted}
            />
          </div>
        ))}
      </div>

      <button className="external-link-button" onClick={openChatGPT} disabled={isChatGPTOpened}>
        Open ChatGPT
      </button>

      <button className="submit-button" onClick={handleSubmit} disabled={isSubmitted || isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default Round2;
