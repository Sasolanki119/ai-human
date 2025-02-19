import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import "../style/login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Default Firestore Structure
  const defaultUserData = (email) => ({
    email: email,
    response: {
      round1: { movie: "", story: "" },
      round2: { isproductssubmited: false, products: { audience: "", desc: "", growth: "", marketing: "" } },
      round3: { role: "", group: "", customGroup: "", problem: "", solution: "" },
      round4: { role: "", problem: "", solution: "" },
    },
    roundStatus: {
      "1": { name: "Round 1", round: 1, status: "Pending" },
      "2": { name: "Round 2", round: 2, status: "Locked" },
      "3": { name: "Round 3", round: 3, status: "Locked" },
      "4": { name: "Round 4", round: 4, status: "Locked" },
    },
  });

  // Handle Login Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!credentials.email || !credentials.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      // Authenticate User
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const user = userCredential.user;
      
      // Save user info in local storage
      localStorage.setItem("user", JSON.stringify(user));

      // Firestore reference for user document
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        console.log("Creating new user document...");
        await setDoc(userDocRef, defaultUserData(user.email));
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      setError("Error logging in. Please check your credentials and try again.");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <h1>AI-Human Collaboration Challenge</h1>
      <div className="login-box">
        {error && <p className="error-message">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={credentials.email}
          onChange={handleChange}
          required
        />

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter Password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
      </div>
    </div>
  );
};

export default Login;




// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { doc, getDoc,setDoc } from "firebase/firestore";
// import { auth, db  } from "../firebaseConfig"; // Import Firestore
// // import { collection, getDocs, query, where } from "firebase/firestore";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { getFirestore, collection, addDoc } from "firebase/firestore"; 
// // import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// import "../style/login.css";

// const Login = () => {
//   const [credentials, setCredentials] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };

  

//  const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError("");

//   if (!credentials.email || !credentials.password) {
//     setError("Please enter both email and password.");
//     return;
//   }

//   setLoading(true);
//   try {
//     // Authenticate user
//     const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
//     const user = userCredential.user;

//     // Save user info in local storage
//     localStorage.setItem("user", JSON.stringify(user));

//     // Firestore reference for the user document
//     const userDocRef = doc(db, "users", user.uid);
//     const userDocSnap = await getDoc(userDocRef);

//     if (!userDocSnap.exists()) {
//       // If user doc does not exist, create it with default structure
//       await setDoc(userDocRef, {
//         email: user.email,
//         response: {
//           round1: { movie: "", story: "" },
//           round2: { isproductssubmited: false, products: { audience: "", desc: "", growth: "", marketing: "" } },
//           round3: { role: "", group: "", customGroup: "", problem: "", solution: "" },
//           round4: { role: "", problem: "", solution: "" }
//         },
//         roundStatus: {
//           "1": { name: "Round 1", round: 1, status: "Pending" },
//           "2": { name: "Round 2", round: 2, status: "Locked" },
//           "3": { name: "Round 3", round: 3, status: "Locked" },
//           "4": { name: "Round 4", round: 4, status: "Locked" }
//         }
//       });
//     }

//     navigate("/dashboard");
//   } catch (error) {
//     console.error("Login Error:", error);
//     setError("Error connecting to database. Check Firestore setup. " + error);
//   }
//   setLoading(false);
// };


//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setError("");

//   //   if (!credentials.email || !credentials.password) {
//   //     setError("Please enter both email and password.");
//   //     return;
//   //   }

//   //   setLoading(true);
//   //   try {
//   //     // Query the "user" collection for a document where the email matches
//   //     // const q = query(
//   //     //   collection(db, "user"),
//   //     //   where("email", "==", credentials.email)
//   //     // );
//   //     // const querySnapshot = await getDocs(q);
//   //     // console.log(querySnapshot);
      

//   //     // let userFound = null;
//   //     // querySnapshot.forEach((doc) => {
//   //     //   const userData = doc.data();
//   //     //   if (userData.password === credentials.password) {
//   //     //     userFound = userData;
//   //     //   }
//   //     // });

//   //     // if (userFound) {
//   //     //   localStorage.setItem("user", JSON.stringify(userFound));
//   //     const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
//   //     const user = userCredential.user;
//   //     localStorage.setItem("user", JSON.stringify(user));
//   //       navigate("/dashboard");
//   //   } catch (error) {
//   //     console.error("Login Error:", error);
//   //     setError("Error connecting to database. Check Firestore setup. " + error);
//   //   }
//   //   setLoading(false);
//   // };

//   console.log(credentials);
  

//   return (
//     <div className="login-container">
//       <h1>AI-Human Collaboration Challenge</h1>
//       <div className="login-box">
//         {error && <p className="error-message">{error}</p>}
//         <input
//           type="email"
//           name="email"
//           placeholder="Enter Email"
//           onChange={handleChange}
//           required
//         />
//         <div className="password-container">
//           <input
//             type={showPassword ? "text" : "password"}
//             name="password"
//             placeholder="Enter Password"
//             onChange={handleChange}
//             required
//           />
//           <button
//             type="button"
//             className="toggle-password"
//             onClick={() => setShowPassword(!showPassword)}
//           >
//             {showPassword ? "🙈" : "👁️"}
//           </button>
//         </div>
//         <button onClick={handleSubmit} disabled={loading}>
//           {loading ? "Logging in..." : "Log In"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Login;
