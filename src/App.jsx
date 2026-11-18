
import { useState } from "react";
import "./App.css";
import StudentDashboard from "./pages/StudentDashboard_temp.jsx";
import AdminDashboard from "./pages/AdminDashboard_temp.jsx";

// ALL 7 STUDENTS
const defaultStudents = [
  {
    id: 1,
    name: "Sruti Sneha Patra",
    roll: "S24C029",
    course: "BCA",
    email: "patrasrutisneha@gmail.com",
    studentPassword: "sruti123",
  },
  {
    id: 2,
    name: "Sandhya Das",
    roll: "S24C011",
    course: "BCA",
    email: "sandhya@gmail.com",
    studentPassword: "sandhya123",
  },
  {
    id: 3,
    name: "Rahul Das",
    roll: "S24C099",
    course: "BCA",
    email: "rahul@gmail.com",
    studentPassword: "rahul123",
  },
  {
    id: 4,
    name: "Kaberi Das",
    roll: "S24C034",
    course: "BCA",
    email: "kaberi@gmail.com",
    studentPassword: "kaberi123",
  },
  {
    id: 5,
    name: "Laxmi Sahu",
    roll: "S24C045",
    course: "BCA",
    email: "laxmi@gmail.com",
    studentPassword: "laxmi123",
  },
  {
    id: 6,
    name: "Manini Das",
    roll: "S24C023",
    course: "BCA",
    email: "manini@gmail.com",
    studentPassword: "manini123",
  },
  {
    id: 7,
    name: "Lipsa Rani Nayak",
    roll: "S24C025",
    course: "BCA",
    email: "lipsa@gmail.com",
    studentPassword: "Lipsa123",
  },
];

// LOAD AND MERGE STUDENT DATA
function getAllStudents() {
  try {
    const savedData = JSON.parse(
      localStorage.getItem("examflow_students") || "[]"
    );

    const savedStudents = Array.isArray(savedData)
      ? savedData
      : [];

    const allStudents = [...defaultStudents];

    savedStudents.forEach((savedStudent) => {
      const index = allStudents.findIndex(
        (student) => student.roll === savedStudent.roll
      );

      if (index !== -1) {
        allStudents[index] = {
          ...allStudents[index],
          ...savedStudent,
        };
      } else {
        allStudents.push(savedStudent);
      }
    });

    // Ensure default login credentials remain available
    return allStudents.map((student) => {
      const defaultStudent = defaultStudents.find(
        (item) => item.roll === student.roll
      );

      if (defaultStudent) {
        return {
          ...student,
          email: defaultStudent.email,
          studentPassword: defaultStudent.studentPassword,
        };
      }

      return student;
    });
  } catch (error) {
    return [...defaultStudents];
  }
}

function App() {
  const [role, setRole] = useState("student");
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentStudent, setCurrentStudent] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const enteredEmail = email.trim().toLowerCase();
    const enteredPassword = password.trim();

    // ADMIN LOGIN
    if (role === "admin") {
      if (
        enteredEmail === "patrasrutisneha@gmail.com" &&
        enteredPassword === "sruti123"
      ) {
        setCurrentStudent(null);
        setLoggedIn(true);
      } else {
        setError("Invalid Admin Email or Password!");
      }

      return;
    }

    // STUDENT LOGIN
    try {
      const allStudents = getAllStudents();

      const matchedStudent = allStudents.find((student) => {
        const studentEmail = String(student.email || "")
          .trim()
          .toLowerCase();

        const savedPassword =
          student.studentPassword || student.password || "";

        return (
          studentEmail === enteredEmail &&
          String(savedPassword).trim() === enteredPassword
        );
      });

      if (matchedStudent) {
        setCurrentStudent(matchedStudent);
        setLoggedIn(true);

        // Save student records
        localStorage.setItem(
          "examflow_students",
          JSON.stringify(allStudents)
        );
      } else {
        setError(
          "Invalid Student Email or Password! Please check your details."
        );
      }
    } catch (error) {
      setError("Student data could not be loaded. Please try again.");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    setLoggedIn(false);
    setCurrentStudent(null);
    setEmail("");
    setPassword("");
    setError("");
    setRole("student");
  };

  // STUDENT DASHBOARD
  if (loggedIn && role === "student") {
    return (
      <StudentDashboard
        student={currentStudent}
        onLogout={handleLogout}
      />
    );
  }

  // ADMIN DASHBOARD
  if (loggedIn && role === "admin") {
    return (
      <AdminDashboard onLogout={handleLogout} />
    );
  }

  // LOGIN PAGE
  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-left">
          <div className="brand">
            <div className="brand-icon">📝</div>
            <h1>ExamFlow</h1>
          </div>

          <div className="welcome-content">
            <span className="welcome-tag">
              ONLINE EXAMINATION PORTAL
            </span>

            <h2>
              Your Learning Journey
              <br />
              Starts Here.
            </h2>

            <p>
              Learn, Practice and Test Your Knowledge.
              Manage your examinations and check your results
              with a simple and smart platform.
            </p>
          </div>

          <div className="login-illustration">
            <div className="illustration-card">
              <span>📚</span>
              <div>
                <strong>Smart Learning</strong>
                <small>Learn something new every day</small>
              </div>
            </div>

            <div className="illustration-card">
              <span>📊</span>
              <div>
                <strong>Track Your Progress</strong>
                <small>Check your exam performance</small>
              </div>
            </div>
          </div>

          <p className="left-footer">
            © 2026 ExamFlow. All rights reserved.
          </p>
        </div>

        <div className="login-right">
          <div className="login-heading">
            <span className="login-small">
              WELCOME BACK
            </span>

            <h2>Sign In</h2>

            <p>Please enter your details to continue.</p>
          </div>

          <form onSubmit={handleLogin}>
            <label>Login As</label>

            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setError("");
              }}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>

            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p
                style={{
                  color: "#dc2626",
                  fontSize: "13px",
                  marginBottom: "15px",
                }}
              >
                {error}
              </p>
            )}

            <button type="submit">
              Login to Dashboard →
            </button>
          </form>

          <div className="login-bottom">
            <div className="security-icon">🔒</div>
            <p>Your information is safe and secure.</p>
          </div>

          <div className="system-name">
            Online Examination & Result Management System
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
