
import { useState } from "react";

function AvailableExams({ onBack, onStartExam }) {
  const [search, setSearch] = useState("");

  const exams = [
    { id: 1, title: "Web Development", subject: "HTML, CSS & JavaScript", duration: "30 Minutes", marks: 20, color: "#6366f1" },
    { id: 2, title: "Database Management", subject: "DBMS & SQL", duration: "30 Minutes", marks: 20, color: "#0ea5e9" },
    { id: 3, title: "Computer Networks", subject: "Networking Fundamentals", duration: "30 Minutes", marks: 20, color: "#f97316" },
    { id: 4, title: "Python Programming", subject: "Python Basics & Logic", duration: "30 Minutes", marks: 20, color: "#16a34a" },
    { id: 5, title: "C Programming", subject: "C Language", duration: "30 Minutes", marks: 20, color: "#9333ea" },
    { id: 6, title: "Java Programming", subject: "Java & OOP", duration: "30 Minutes", marks: 20, color: "#db2777" },
    { id: 7, title: "Operating System", subject: "OS Concepts & Functions", duration: "30 Minutes", marks: 20, color: "#0891b2" },
    { id: 8, title: "Computer Fundamentals", subject: "MS Office & Basic Computer", duration: "30 Minutes", marks: 20, color: "#ca8a04" },
    { id: 9, title: "Software Engineering", subject: "SDLC & Software Testing", duration: "30 Minutes", marks: 20, color: "#4f46e5" },
    { id: 10, title: "Cyber Security", subject: "Internet Security", duration: "30 Minutes", marks: 20, color: "#dc2626" },
    { id: 11, title: "Data Structures", subject: "DSA & Algorithms", duration: "30 Minutes", marks: 20, color: "#0d9488" },
    { id: 12, title: "Computer Organization", subject: "COA Fundamentals", duration: "30 Minutes", marks: 20, color: "#7c3aed" },
    { id: 13, title: "Digital Electronics", subject: "Logic Gates & Circuits", duration: "30 Minutes", marks: 20, color: "#ea580c" },
    { id: 14, title: "Artificial Intelligence", subject: "AI Basics", duration: "30 Minutes", marks: 20, color: "#2563eb" },
    { id: 15, title: "Machine Learning", subject: "ML Fundamentals", duration: "30 Minutes", marks: 20, color: "#059669" },
    { id: 16, title: "Data Analytics", subject: "Excel & Data Analysis", duration: "30 Minutes", marks: 20, color: "#be123c" },
    { id: 17, title: "Computer Graphics", subject: "Graphics Fundamentals", duration: "30 Minutes", marks: 20, color: "#7e22ce" },
    { id: 18, title: "Cloud Computing", subject: "Cloud Fundamentals", duration: "30 Minutes", marks: 20, color: "#0284c7" },
    { id: 19, title: "Internet of Things", subject: "IoT Fundamentals", duration: "30 Minutes", marks: 20, color: "#65a30d" },
    { id: 20, title: "Mathematics", subject: "Discrete Mathematics", duration: "30 Minutes", marks: 20, color: "#c026d3" }
  ];

  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(search.toLowerCase()) ||
    exam.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f1f5f9",
      padding: "30px"
    }}>
      <h1 style={{ color: "#4338ca" }}>ExamFlow</h1>

      <button onClick={onBack} style={{
        marginTop: "20px",
        padding: "10px 20px",
        background: "#4338ca",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer"
      }}>
        ← Back to Dashboard
      </button>

      <h2 style={{ marginTop: "30px", color: "#1e293b" }}>
        Available Exams
      </h2>

      <p style={{ color: "#64748b", marginTop: "8px" }}>
        Explore and choose your examination.
      </p>

      <input
        type="text"
        placeholder="Search exams..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "13px",
          marginTop: "22px",
          border: "1px solid #cbd5e1",
          borderRadius: "8px",
          fontSize: "15px"
        }}
      />

      <p style={{ marginTop: "20px", color: "#475569" }}>
        Showing {filteredExams.length} of 20 Exams
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
        marginTop: "20px"
      }}>
        {filteredExams.map((exam) => (
          <div key={exam.id} style={{
            background: "white",
            padding: "22px",
            borderRadius: "14px",
            borderTop: `5px solid ${exam.color}`,
            boxShadow: "0 3px 12px rgba(0,0,0,0.07)"
          }}>
            <h3 style={{ color: "#1e293b" }}>
              {exam.id}. {exam.title}
            </h3>

            <p style={{ color: "#64748b", marginTop: "10px" }}>
              {exam.subject}
            </p>

            <p style={{ marginTop: "15px" }}>
              ⏱️ {exam.duration}
            </p>

            <p style={{ marginTop: "8px" }}>
              📝 {exam.marks} Marks
            </p>

           <button
  onClick={() => onStartExam(exam)}
  style={{
    width: "100%",
    marginTop: "18px",
    padding: "12px",
    background: exam.color,
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  }}
>
  Start Exam
</button>
          </div>
        ))}
      </div>

      {filteredExams.length === 0 && (
        <p style={{ marginTop: "25px", color: "#dc2626" }}>
          No exams found!
        </p>
      )}
    </div>
  );
}

export default AvailableExams;
