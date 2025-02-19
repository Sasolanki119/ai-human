import { useState, useEffect } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../style/Round4.css";

const Round4 = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  const [selectedGroup, setSelectedGroup] = useState("");
  const [customGroup, setCustomGroup] = useState("");
  const [role, setRole] = useState(""); // Changed to TextField
  const [problemStatement, setProblemStatement] = useState("Your problem statement here...");
  const [solution, setSolution] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const groups = ["Group A", "Group B", "Group C", "Group D", "Other"];

  useEffect(() => {
    alert("Round 4 has started! You have 30 minutes.");
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 60) alert("1 minute remaining! Submit soon.");
        if (prev <= 1) {
          clearInterval(timer);
          alert("Time's up! Auto-submitting...");
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("Please log in.");
      return;
    }
    if (!selectedGroup || (selectedGroup === "Other" && !customGroup) || !role || !solution || !problemStatement) {
      alert("Fill in all required fields.");
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      alert("User not found!");
      return;
    }

    const userData = userDocSnap.data();
    const updatedRounds = userData.rounds.map((round) =>
      round.roundId === 4 ? { ...round, status: "Completed" } : round
    );

    try {
      await updateDoc(userDocRef, {
        "response.round4": {
          group: selectedGroup === "Other" ? customGroup : selectedGroup,
          role,
          problemStatement,
          solution,
          timestamp: new Date(),
        },
        "roundStatus.4.status": "Completed",
        rounds: updatedRounds,
      });

      alert("Response submitted!");
      setIsSubmitted(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      alert("Submission failed.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  return (
    <div className="round-container">
      <h1>Round 4: The Social Bond</h1>
      <div className="timer">⏳ Time Left: {formatTime(timeLeft)}</div>

      <div className="horizontal-container">
        <div className="container-1">
          <div className="dropdown-container">
            <label>Select Your Group:</label>
            <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} disabled={isSubmitted}>
              <option value="">-- Select a Group --</option>
              {groups.map((group, index) => (
                <option key={index} value={group}>{group}</option>
              ))}
            </select>
            {selectedGroup === "Other" && (
              <input
                type="text"
                placeholder="Enter Group name"
                value={customGroup}
                onChange={(e) => setCustomGroup(e.target.value)}
                disabled={isSubmitted}
              />
            )}

            <label>Enter Your Role:</label>
            <input
              type="text"
              placeholder="Enter your role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isSubmitted}
            />
          </div>

          <h3>Problem Statement</h3>
          <textarea
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            placeholder="Enter your problem statement here..."
            disabled={isSubmitted}
          />
        </div>

        <div className="container-2">
          <h3>Your Solution</h3>
          <textarea
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="Enter your solution here..."
            disabled={isSubmitted}
          />

          {/* Open ChatGPT Button */}
          <button
            className="open-chatgpt-btn"
            onClick={() => window.open("https://chat.openai.com", "_blank")}
          >
            Open ChatGPT
          </button>

          <button className="submit-btn" disabled={isSubmitted} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Round4;




// import { useState, useEffect } from "react";
// import "../style/Round4.css";

// const Round4 = () => {
//   const [problem, setProblem] = useState("");
//   const [aiPrompt, setAiPrompt] = useState("");
//   const [aiResponse, setAiResponse] = useState("");
//   const [solution, setSolution] = useState("");
//   const [aiUsed, setAiUsed] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(1800);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const requestAIHelp = async () => {
//     if (aiUsed) return;
//     setAiUsed(true);
//     const response = await fetch("/api/ai-assist", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ query: aiPrompt }),
//     });
//     const data = await response.json();
//     setAiResponse(data.aiReply);
//   };

//   const handleSubmit = async () => {
//     await fetch("/api/submit-round4", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ problem, aiResponse, solution }),
//     });
//     alert("Solution submitted successfully!");
//   };

//   useEffect(() => {
//     if (timeLeft === 0) handleSubmit();
//   }, [timeLeft]);

//   return (
//     <div className="round4-container">
//       <h1>Round 4: The Social Bond</h1>
//       <div className="timer">Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</div>
      
//       <div className="main-container">
//         <div className="input-container">
//           <textarea
//             className="problem-box"
//             placeholder="Enter problem statement here..."
//             value={problem}
//             onChange={(e) => setProblem(e.target.value)}
//           ></textarea>
//           <textarea
//             className="solution-box"
//             placeholder="Enter your solution here..."
//             value={solution}
//             onChange={(e) => setSolution(e.target.value)}
//           ></textarea>
//         </div>

//         <div className="ai-container">
//           <textarea
//             className="ai-input"
//             placeholder="Enter AI prompt here..."
//             value={aiPrompt}
//             onChange={(e) => setAiPrompt(e.target.value)}
//           ></textarea>
//           <button onClick={requestAIHelp} disabled={aiUsed} className="ai-btn">{aiUsed ? "AI Response Received" : "Request AI Assistance"}</button>
//           {aiUsed && <div className="ai-response">AI Insight: {aiResponse}</div>}
//         </div>
//       </div>
      
//       <button onClick={handleSubmit} className="submit-btn">Submit Solution</button>
//     </div>
//   );
// };

// export default Round4;