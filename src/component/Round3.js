import { useState, useEffect } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // 🚀 Redirect feature

import "../style/Round3.css";

const Round3 = () => {
  const auth = getAuth();
  const navigate = useNavigate(); // 🚀 Hook for redirection
  const [user, setUser] = useState(null);
  const initialTime = 20 * 60;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [customGroup, setCustomGroup] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [problemStatement, setProblemStatement] = useState("Your given problem statement goes here...");
  const [solution, setSolution] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const groups = ["Group A", "Group B", "Group C", "Group D", "Other"];
  const agents = ["Spy", "Diplomat", "Strategist", "Analyst"];

  useEffect(() => {
    alert("Round 3 has started! You have 20 minutes to complete it.");
    
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 60) {
          alert("1 minute remaining! Submit your response soon.");
        }
        if (prevTime <= 1) {
          clearInterval(timer);
          alert("Time's up! Submitting is now disabled.");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("User is not authenticated. Please log in and try again.");
      return;
    }

    if (!selectedGroup || (selectedGroup === "Other" && !customGroup) || !selectedAgent || !solution || !problemStatement) {
      alert("Please fill in all required fields.");
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      alert("User document not found!");
      return;
    }

    const userData = userDocSnap.data();
    const currentRounds = userData.rounds || [];
    const updatedRounds = currentRounds.map((round) =>
      round.roundId === 3 ? { ...round, status: "Completed" } : round
    );

    try {
      await updateDoc(userDocRef, {
        "response.round3": {
          group: selectedGroup === "Other" ? customGroup : selectedGroup,
          agent: selectedAgent,
          problemStatement,
          solution,
          timestamp: new Date(),
        },
        "roundStatus.3.status": "Completed",
        "roundStatus.4.status": "Pending",
        rounds: updatedRounds,
      });

      alert("Your response has been submitted successfully!");
      setIsSubmitted(true);

      setTimeout(() => {
        navigate("/dashboard"); // 🚀 Redirect to Dashboard after 2 seconds
      }, 2000);
    } catch (error) {
      console.error("Error saving response:", error);
      alert("There was an error submitting your response.");
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
      <h1>Round 3: United Front – Guardians of the Nation</h1>
      <div className="timer">Time Left: {formatTime(timeLeft)}</div>

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

            <label>Select Your Role:</label>
            <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} disabled={isSubmitted}>
              <option value="">-- Select a Role --</option>
              {agents.map((agent, index) => (
                <option key={index} value={agent}>{agent}</option>
              ))}
            </select>
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

export default Round3;





// import { useState, useEffect } from "react";
// import { 
//   doc, 
//   updateDoc, 
//   getDoc,
//   collection, 
//   query, 
//   where, 
//   getDocs 
// } from "firebase/firestore";
// import { db } from "../firebaseConfig";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

// import "../style/Round3.css";

// const Round3 = () => {
//   const auth = getAuth();
//   const [user, setUser] = useState(null);
//   const initialTime = 20 * 60;
//   const [timeLeft, setTimeLeft] = useState(initialTime);
//   const [selectedGroup, setSelectedGroup] = useState("");
//   const [customGroup, setCustomGroup] = useState("");
//   const [selectedAgent, setSelectedAgent] = useState("");
//   const [solution, setSolution] = useState("");
//   const [chatPrompt, setChatPrompt] = useState("");
//   const [isPromptSent, setIsPromptSent] = useState(false);
//   const [submitDisabled, setSubmitDisabled] = useState(false);

//   // Ensure the group values match the condition in JSX ("Other")
//   const groups = ["Group A", "Group B", "Group C", "Group D", "Other"];
//   const agents = ["Spy", "Diplomat", "Strategist", "Analyst"];

//   useEffect(() => {
//     // Alert the player when the round starts
//     alert("Round 3 has started! You have 20 minutes to complete it.");
    
//     // Set up the timer
//     const timer = setInterval(() => {
//       setTimeLeft((prevTime) => {
//         if (prevTime === 60) {
//           alert("1 minute remaining! Submit your response soon.");
//         }
//         if (prevTime <= 1) {
//           clearInterval(timer);
//           setSubmitDisabled(true);
//           alert("Time's up! Submitting is now disabled.");
//           return 0;
//         }
//         return prevTime - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   // Formats seconds into MM:SS format
//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   // Handles sending the ChatGPT prompt (only once allowed)
//   const handleSendPrompt = () => {
//     if (!isPromptSent && chatPrompt.trim() !== "") {
//       setIsPromptSent(true);
//       alert("Prompt sent to ChatGPT");
//     }
//   };

//   /**
//    * Helper function to retrieve the user's Firestore document reference
//    * from the "user" collection by querying the email field.
//    */
//   const getUserDocRef = async () => {
//     const userCollectionRef = collection(db, "user");
//     const q = query(userCollectionRef, where("email", "==", user.email));
//     const querySnapshot = await getDocs(q);
//     if (querySnapshot.empty) {
//       console.error("User document not found!");
//       alert("User document not found!");
//       return null;
//     }
//     return doc(db, "user", querySnapshot.docs[0].id);
//   };

//   // Handles the form submission and storing data in Firestore
//   const handleSubmit = async () => {
//     if (!user) {
//       alert("User is not authenticated. Please log in and try again.");
//       return;
//     }

//     const round3Data = {
//       group: selectedGroup,
//       customGroup,
//       agent: selectedAgent,
//       solution,
//       chatPrompt,
//       timestamp: new Date(),
//     };

//     // Get the user document reference from the "user" collection
//     const userDocRef = await getUserDocRef();
//     if (!userDocRef) return;

//     // Retrieve the current rounds array from the user document
//     const userDocSnap = await getDoc(userDocRef);
//     if (!userDocSnap.exists()) {
//       alert("User document not found!");
//       return;
//     }
//     const currentRounds = userDocSnap.data().rounds || [];
//     const updatedRounds = currentRounds.map((round) =>
//       round.roundId === 3 ? { ...round, status: "Completed" } : round
//     );

//     try {
//       await updateDoc(userDocRef, {
//         round3: round3Data,
//         rounds: updatedRounds,
//       });
//       alert("Your response has been saved successfully!");
//     } catch (error) {
//       console.error("Error saving response: ", error);
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return () => unsubscribe();
//   }, [auth]);

//   return (
//     <div className="round-container">
//       <h1>Round 3: United Front – Guardians of the Nation</h1>
//       <div className="timer">Time Left: {formatTime(timeLeft)}</div>

//       {/* Parent container for horizontal layout */}
//       <div className="horizontal-container">
//         {/* First Container */}
//         <div className="container-1">
//           <div className="dropdown-container">
//             <label>Select Your Group:</label>
//             <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
//               <option value="">-- Select a Group --</option>
//               {groups.map((group, index) => (
//                 <option key={index} value={group}>{group}</option>
//               ))}
//             </select>
//             {selectedGroup === "Other" && (
//               <input
//                 type="text"
//                 placeholder="Enter Group name"
//                 value={customGroup}
//                 onChange={(e) => setCustomGroup(e.target.value)}
//               />
//             )}

//             <label>Select Your Role:</label>
//             <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
//               <option value="">-- Select a Role --</option>
//               {agents.map((agent, index) => (
//                 <option key={index} value={agent}>{agent}</option>
//               ))}
//             </select>
//           </div>

//           <h3>Problem Statement</h3>
//           <textarea
//             readOnly
//             className="problem"
//             value="Your given problem statement goes here..."
//           />
//         </div>

//         {/* Second Container */}
//         <div className="container-2">
//           <h3>Your Solution</h3>
//           <textarea
//             value={solution}
//             onChange={(e) => setSolution(e.target.value)}
//             placeholder="Enter your solution here..."
//           />

//           <div className="chatgpt-container">
//             <h3>ChatGPT Assistance</h3>
//             <textarea
//               placeholder="Enter your ChatGPT prompt..."
//               value={chatPrompt}
//               onChange={(e) => setChatPrompt(e.target.value)}
//             />
//             <button onClick={handleSendPrompt} disabled={isPromptSent}>
//               Send Prompt
//             </button>
//           </div>

//           <button className="submit-btn" disabled={submitDisabled} onClick={handleSubmit}>
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Round3;
