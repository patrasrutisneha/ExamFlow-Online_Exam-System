
import { useState, useEffect } from "react";

import AvailableExams from "./AvailableExams";
import ExamPage from "./ExamPage";
import MyResults from "./MyResults";
import MyProfile from "./MyProfile";

function getSavedResults() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("examflow_results") || "[]"
    );
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function getStudentDetails(student) {
  return {
    name: student?.name || "Student",
    roll: student?.roll || student?.rollNumber || "",
    course: student?.course || "BCA",
    email: student?.email || "",
    marks: student?.marks ?? 0,
    semester: student?.semester || "5th Semester",
    college:
      student?.college ||
      "Sparsh College of Computer and Management"
  };
}

function StudentDashboard({ student: loggedInStudent, onLogout }) {
  const student = getStudentDetails(loggedInStudent);

  const [results, setResults] = useState(getSavedResults);
  const [selectedExam, setSelectedExam] = useState(null);
  const [showExams, setShowExams] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    setResults(getSavedResults());
  }, []);

  // Only logged-in student's results
  const myResults = results.filter((result) => {
    if (result.studentRoll && student.roll) {
      return (
        String(result.studentRoll).toLowerCase() ===
        String(student.roll).toLowerCase()
      );
    }

    return (
      String(result.studentName || "").toLowerCase() ===
      String(student.name).toLowerCase()
    );
  });

  // Dashboard calculations
  const totalExams = 20;
  const examsAttended = myResults.length;

  const averageScore =
    examsAttended > 0
      ? Math.round(
          myResults.reduce(
            (sum, result) =>
              sum +
              Number(
                result.percentage ??
                (Number(result.total) > 0
                  ? (Number(result.score) / Number(result.total)) * 100
                  : 0)
              ),
            0
          ) / examsAttended
        )
      : 0;

  const recentResults = [...myResults]
    .sort((a, b) => Number(b.id || 0) - Number(a.id || 0))
    .slice(0, 5);

  // Save examination result
  const saveResult = (examResult) => {
    const newResult = {
      id: Date.now(),
      examName: examResult.examName || "Online Examination",
      score: Number(examResult.score) || 0,
      total: Number(examResult.total) || 0,
      percentage: Number(examResult.percentage) || 0,
      studentName: student.name,
      studentRoll: student.roll,
      studentCourse: student.course,
      studentEmail: student.email,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    };

    const oldResults = getSavedResults();
    const updatedResults = [...oldResults, newResult];

    localStorage.setItem(
      "examflow_results",
      JSON.stringify(updatedResults)
    );

    setResults(updatedResults);
    setSelectedExam(null);
    setShowExams(false);
    setShowResults(true);
    setShowProfile(false);
  };

  if (selectedExam) {
    return (
      <ExamPage
        exam={selectedExam}
        onBack={() => setSelectedExam(null)}
        onSubmit={saveResult}
      />
    );
  }

  if (showExams) {
    return (
      <AvailableExams
        onBack={() => setShowExams(false)}
        onStartExam={(exam) => setSelectedExam(exam)}
      />
    );
  }

  if (showResults) {
    return (
      <MyResults
        results={myResults}
        onBack={() => setShowResults(false)}
      />
    );
  }

  if (showProfile) {
    return (
      <MyProfile
        student={student}
        onBack={() => setShowProfile(false)}
      />
    );
  }

  return (
    <div style={dashboardStyle}>

      {/* HEADER */}
      <header style={headerStyle}>
        <div style={brandContainer}>
          <h1 style={brandTitle}>🎓 ExamFlow</h1>
          <p style={brandSubtitle}>Student Dashboard</p>
        </div>

        <div style={headerRight}>
          <span style={studentBadge}>
            👤 {student.name}
          </span>

          <button
            style={logoutButton}
            onClick={onLogout}
          >
            Logout ↗
          </button>
        </div>
      </header>

      {/* WELCOME SECTION */}
      <section style={welcomeStyle}>
        <h2>Welcome, {student.name}! 👋</h2>

        <p>
          Roll Number: {student.roll} | Course: {student.course}
        </p>

        <p>
          All the best for your examination. Keep learning and keep growing!
        </p>
      </section>

      {/* STATISTICS */}
      <section style={statsContainer}>

        <div style={{ ...statCard, borderTop: "5px solid #4f46e5" }}>
          <div style={statIcon}>📝</div>
          <h3 style={statHeading}>Total Exams</h3>
          <h1 style={{ ...statNumber, color: "#4338ca" }}>
            {totalExams}
          </h1>
          <p style={statDescription}>Available Examinations</p>
        </div>

        <div style={{ ...statCard, borderTop: "5px solid #0891b2" }}>
          <div style={statIcon}>📚</div>
          <h3 style={statHeading}>Exams Attended</h3>
          <h1 style={{ ...statNumber, color: "#0891b2" }}>
            {examsAttended}
          </h1>
          <p style={statDescription}>Your Exam Attempts</p>
        </div>

        <div style={{ ...statCard, borderTop: "5px solid #059669" }}>
          <div style={statIcon}>📊</div>
          <h3 style={statHeading}>Average Score</h3>
          <h1 style={{ ...statNumber, color: "#059669" }}>
            {averageScore}%
          </h1>
          <p style={statDescription}>Your Average Percentage</p>
        </div>

      </section>

      {/* MAIN DASHBOARD CARDS */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>Student Activities</h2>
        <p style={sectionSubtitle}>
          Choose an option to continue
        </p>

        <div style={cardContainer}>

          <div style={actionCard}>
            <div style={actionIcon}>📝</div>
            <h2>Available Exams</h2>
            <p>
              View all available examinations and start your exam.
            </p>
            <button
              style={actionButton}
              onClick={() => setShowExams(true)}
            >
              View Exams →
            </button>
          </div>

          <div style={actionCard}>
            <div style={actionIcon}>📊</div>
            <h2>My Results</h2>
            <p>
              Check your examination marks and performance.
            </p>
            <button
              style={actionButton}
              onClick={() => setShowResults(true)}
            >
              View Results ({examsAttended}) →
            </button>
          </div>

          <div style={actionCard}>
            <div style={actionIcon}>👤</div>
            <h2>My Profile</h2>
            <p>
              View your personal student information.
            </p>
            <button
              style={actionButton}
              onClick={() => setShowProfile(true)}
            >
              View Profile →
            </button>
          </div>

        </div>
      </section>

      {/* RECENT RESULTS */}
      <section style={recentSection}>
        <div style={recentHeader}>
          <div>
            <h2 style={sectionTitle}>📋 Recent Results</h2>
            <p style={sectionSubtitle}>
              Your latest examination performance
            </p>
          </div>

          <button
            style={smallButton}
            onClick={() => setShowResults(true)}
          >
            View All
          </button>
        </div>

        {recentResults.length === 0 ? (
          <div style={emptyBox}>
            <div style={{ fontSize: "40px" }}>📚</div>
            <h3>No Results Yet</h3>
            <p>
              You have not attended any examination yet.
              Start your first exam!
            </p>
            <button
              style={actionButton}
              onClick={() => setShowExams(true)}
            >
              Start Exam
            </button>
          </div>
        ) : (
          <div style={tableWrapper}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Sl. No.</th>
                  <th style={thStyle}>Exam Name</th>
                  <th style={thStyle}>Marks</th>
                  <th style={thStyle}>Percentage</th>
                  <th style={thStyle}>Date</th>
                </tr>
              </thead>

              <tbody>
                {recentResults.map((result, index) => {
                  const percentage =
                    Number(
                      result.percentage ??
                      (Number(result.total) > 0
                        ? (Number(result.score) / Number(result.total)) * 100
                        : 0)
                    );

                  return (
                    <tr key={result.id || index}>
                      <td style={tdStyle}>{index + 1}</td>
                      <td style={tdStyle}>{result.examName}</td>
                      <td style={tdStyle}>
                        {result.score}/{result.total}
                      </td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            ...percentageBadge,
                            background:
                              percentage >= 40 ? "#dcfce7" : "#fee2e2",
                            color:
                              percentage >= 40 ? "#166534" : "#991b1b"
                          }}
                        >
                          {Math.round(percentage)}%
                        </span>
                      </td>
                      <td style={tdStyle}>{result.date || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer style={footerStyle}>
        <h3 style={{ margin: "0 0 8px" }}>🎓 ExamFlow</h3>
        <p>
          Online Examination and Result Management System
        </p>
        <p style={{ fontSize: "13px" }}>
          © 2026 ExamFlow. All Rights Reserved.
        </p>
      </footer>

    </div>
  );
}

/* STYLES */

const dashboardStyle = {
  minHeight: "100vh",
  background: "#f1f5f9",
  fontFamily: "Arial, sans-serif",
  color: "#1e293b"
};

const headerStyle = {
  background: "linear-gradient(120deg, #312e81, #4f46e5)",
  color: "white",
  padding: "22px 35px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
};

const brandContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "8px"
};

const brandTitle = {
  margin: 0,
  fontSize: "34px",
  lineHeight: "1.3"
};

const brandSubtitle = {
  margin: 0,
  fontSize: "15px",
  color: "#ddd6fe"
};

const headerRight = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  flexWrap: "wrap"
};

const studentBadge = {
  background: "rgba(255,255,255,0.15)",
  padding: "10px 15px",
  borderRadius: "8px",
  fontSize: "14px"
};

const logoutButton = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "11px 22px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold"
};

const welcomeStyle = {
  background: "white",
  margin: "28px 30px",
  padding: "28px 20px",
  borderRadius: "14px",
  textAlign: "center",
  boxShadow: "0 3px 12px rgba(0,0,0,0.06)"
};

const statsContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "22px",
  padding: "0 30px 30px"
};

const statCard = {
  background: "white",
  padding: "22px 15px",
  borderRadius: "13px",
  textAlign: "center",
  boxShadow: "0 3px 12px rgba(0,0,0,0.06)"
};

const statIcon = {
  fontSize: "32px"
};

const statHeading = {
  fontSize: "17px",
  margin: "10px 0"
};

const statNumber = {
  fontSize: "38px",
  margin: "10px 0"
};

const statDescription = {
  color: "#64748b",
  fontSize: "13px",
  margin: 0
};

const sectionStyle = {
  padding: "10px 30px 35px"
};

const sectionTitle = {
  fontSize: "23px",
  margin: "0 0 8px"
};

const sectionSubtitle = {
  color: "#64748b",
  margin: "0 0 22px",
  fontSize: "14px"
};

const cardContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "24px"
};

const actionCard = {
  background: "white",
  padding: "28px 20px",
  borderRadius: "14px",
  textAlign: "center",
  boxShadow: "0 3px 12px rgba(0,0,0,0.07)"
};

const actionIcon = {
  fontSize: "42px",
  marginBottom: "10px"
};

const actionButton = {
  background: "#4338ca",
  color: "white",
  border: "none",
  padding: "11px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  marginTop: "12px",
  fontWeight: "bold"
};

const recentSection = {
  background: "white",
  margin: "0 30px 35px",
  padding: "25px",
  borderRadius: "14px",
  boxShadow: "0 3px 12px rgba(0,0,0,0.06)"
};

const recentHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "12px"
};

const smallButton = {
  background: "#059669",
  color: "white",
  border: "none",
  padding: "10px 17px",
  borderRadius: "7px",
  cursor: "pointer"
};

const emptyBox = {
  textAlign: "center",
  background: "#f8fafc",
  padding: "30px 15px",
  borderRadius: "10px",
  color: "#64748b"
};

const tableWrapper = {
  width: "100%",
  overflowX: "auto"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "600px"
};

const thStyle = {
  background: "#e0e7ff",
  color: "#312e81",
  padding: "14px 12px",
  textAlign: "left",
  fontSize: "14px"
};

const tdStyle = {
  padding: "14px 12px",
  borderBottom: "1px solid #e2e8f0",
  fontSize: "14px"
};

const percentageBadge = {
  padding: "5px 10px",
  borderRadius: "20px",
  fontWeight: "bold",
  fontSize: "13px"
};

const footerStyle = {
  background: "#1e1b4b",
  color: "white",
  textAlign: "center",
  padding: "25px 15px",
  marginTop: "20px"
};

export default StudentDashboard;
