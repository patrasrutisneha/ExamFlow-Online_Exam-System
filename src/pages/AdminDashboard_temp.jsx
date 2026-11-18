
import { useState, useEffect } from "react";
import ExamManagement from "./ExamManagement";
import AdminResults from "./AdminResults";

// DEFAULT 7 STUDENTS
const defaultStudents = [
  {
    id: 1,
    name: "Sruti Sneha Patra",
    roll: "S24C029",
    course: "BCA",
    marks: 97,
    email: "patrasrutisneha@gmail.com",
    studentPassword: "sruti123",
  },
  {
    id: 2,
    name: "Sandhya Das",
    roll: "S24C011",
    course: "BCA",
    marks: 92,
    email: "sandhya@gmail.com",
    studentPassword: "sandhya123",
  },
  {
    id: 3,
    name: "Rahul Das",
    roll: "S24C099",
    course: "BCA",
    marks: 85,
    email: "rahul@gmail.com",
    studentPassword: "rahul123",
  },
  {
    id: 4,
    name: "Kaberi Das",
    roll: "S24C034",
    course: "BCA",
    marks: 76,
    email: "kaberi@gmail.com",
    studentPassword: "kaberi123",
  },
  {
    id: 5,
    name: "Laxmi Sahu",
    roll: "S24C045",
    course: "BCA",
    marks: 88,
    email: "laxmi@gmail.com",
    studentPassword: "laxmi123",
  },
  {
    id: 6,
    name: "Manini Das",
    roll: "S24C023",
    course: "BCA",
    marks: 89,
    email: "manini@gmail.com",
    studentPassword: "manini123",
  },
  {
    id: 7,
    name: "Lipsa Rani Nayak",
    roll: "S24C025",
    course: "BCA",
    marks: 76,
    email: "lipsa@gmail.com",
    studentPassword: "Lipsa123",
  },
];

// LOAD STUDENTS FROM LOCAL STORAGE
function getSavedStudents() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("examflow_students") || "[]"
    );

    if (!Array.isArray(saved) || saved.length === 0) {
      localStorage.setItem(
        "examflow_students",
        JSON.stringify(defaultStudents)
      );
      return defaultStudents;
    }

    const merged = [...defaultStudents];

    saved.forEach((student) => {
      const index = merged.findIndex(
        (item) => item.roll === student.roll
      );

      if (index >= 0) {
        merged[index] = {
          ...merged[index],
          ...student,
        };
      } else {
        merged.push(student);
      }
    });

    localStorage.setItem(
      "examflow_students",
      JSON.stringify(merged)
    );

    return merged;
  } catch {
    localStorage.setItem(
      "examflow_students",
      JSON.stringify(defaultStudents)
    );
    return defaultStudents;
  }
}

function AdminDashboard({ onLogout }) {
  const [students, setStudents] = useState(getSavedStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showExams, setShowExams] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    roll: "",
    email: "",
    studentPassword: "",
    course: "BCA",
    marks: "",
  });

  const [examCount, setExamCount] = useState(0);
  const [resultCount, setResultCount] = useState(0);

  // SAVE STUDENTS
  useEffect(() => {
    localStorage.setItem(
      "examflow_students",
      JSON.stringify(students)
    );
  }, [students]);

  // UPDATE DASHBOARD COUNTS
  useEffect(() => {
    const updateCounts = () => {
      try {
        const exams = JSON.parse(
          localStorage.getItem("examflow_exams") || "[]"
        );

        const results = JSON.parse(
          localStorage.getItem("examflow_results") || "[]"
        );

        setExamCount(
          Array.isArray(exams) ? exams.length : 0
        );

        setResultCount(
          Array.isArray(results) ? results.length : 0
        );
      } catch {
        setExamCount(0);
        setResultCount(0);
      }
    };

    updateCounts();

    window.addEventListener("storage", updateCounts);

    return () => {
      window.removeEventListener("storage", updateCounts);
    };
  }, [showExams, showResults]);

  // INPUT STYLE
  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "6px",
    marginBottom: "14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    boxSizing: "border-box",
    fontSize: "14px",
  };

  // BUTTON STYLE
  const buttonStyle = {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  // HANDLE FORM CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // RESET FORM
  const resetForm = () => {
    setFormData({
      name: "",
      roll: "",
      email: "",
      studentPassword: "",
      course: "BCA",
      marks: "",
    });

    setEditId(null);
    setShowForm(false);
  };

  // ADD / UPDATE STUDENT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.roll.trim() ||
      !formData.email.trim() ||
      !formData.studentPassword.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const duplicate = students.find(
      (student) =>
        student.roll.toLowerCase() ===
          formData.roll.trim().toLowerCase() &&
        student.id !== editId
    );

    if (duplicate) {
      alert("This roll number already exists!");
      return;
    }

    const studentData = {
      id: editId || Date.now(),
      name: formData.name.trim(),
      roll: formData.roll.trim(),
      email: formData.email.trim().toLowerCase(),
      studentPassword: formData.studentPassword.trim(),
      course: formData.course,
      marks: Number(formData.marks) || 0,
    };

    if (editId) {
      setStudents((previous) =>
        previous.map((student) =>
          student.id === editId ? studentData : student
        )
      );

      alert("Student details updated successfully!");
    } else {
      setStudents((previous) => [
        ...previous,
        studentData,
      ]);

      alert("New student added successfully!");
    }

    resetForm();
  };

  // EDIT STUDENT
  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      roll: student.roll,
      email: student.email || "",
      studentPassword: student.studentPassword || "",
      course: student.course || "BCA",
      marks: student.marks ?? "",
    });

    setEditId(student.id);
    setShowForm(true);
  };

  // DELETE STUDENT
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (confirmDelete) {
      setStudents((previous) =>
        previous.filter((student) => student.id !== id)
      );
    }
  };

  // SEARCH STUDENTS
  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.roll} ${student.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // STUDENT PERFORMANCE SUMMARY
  const averageMarks = students.length
    ? Math.round(
        students.reduce(
          (sum, student) => sum + Number(student.marks || 0),
          0
        ) / students.length
      )
    : 0;

  const highestMarks = students.length
    ? Math.max(...students.map((student) => Number(student.marks || 0)))
    : 0;

  // EXAM MANAGEMENT PAGE
  if (showExams) {
    return (
      <ExamManagement
        onBack={() => setShowExams(false)}
      />
    );
  }

  // ADMIN RESULTS PAGE
  if (showResults) {
    return (
      <AdminResults
        onBack={() => setShowResults(false)}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* SEPARATE HEADER */}
      <header
        style={{
          background: "#172554",
          color: "white",
          padding: "20px 35px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
        }}
      >
        {/* EXAMFLOW BRAND */}
        <div style={{ minWidth: "180px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            📝 ExamFlow
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              color: "#bfdbfe",
              fontSize: "13px",
              letterSpacing: "1px",
            }}
          >
            ONLINE EXAMINATION PORTAL
          </p>
        </div>

        {/* ADMIN DASHBOARD TITLE */}
        <div
          style={{
            textAlign: "center",
            flex: 1,
            minWidth: "180px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "25px",
              color: "white",
            }}
          >
            Admin Dashboard
          </h2>

          <p
            style={{
              margin: "6px 0 0",
              color: "#bfdbfe",
              fontSize: "13px",
            }}
          >
            Management Panel
          </p>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={onLogout}
          style={{
            ...buttonStyle,
            background: "#ef4444",
            color: "white",
            padding: "12px 22px",
          }}
        >
          Logout
        </button>
      </header>

      {/* MAIN DASHBOARD */}
      <main
        style={{
          padding: "30px",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        <h2 style={{ color: "#172554" }}>
          Welcome, Admin!
        </h2>

        <p style={{ color: "#64748b" }}>
          Manage students, examinations and results from here.
        </p>

        {/* DASHBOARD CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginTop: "25px",
          }}
        >
          <div style={cardStyle("#2563eb")}>
            <div style={{ fontSize: "30px" }}>👨‍🎓</div>
            <h3>Total Students</h3>
            <h1>{students.length}</h1>
            <p>Registered Students</p>
          </div>

          <div style={cardStyle("#7c3aed")}>
            <div style={{ fontSize: "30px" }}>📝</div>
            <h3>Total Exams</h3>
            <h1>{Math.max(examCount, 20)}</h1>
            <p>Available Examinations</p>
          </div>

          <div style={cardStyle("#059669")}>
            <div style={{ fontSize: "30px" }}>📊</div>
            <h3>Results Published</h3>
            <h1>{resultCount}</h1>
            <p>Total Exam Attempts</p>
          </div>

          <div style={cardStyle("#ea580c")}>
            <div style={{ fontSize: "30px" }}>🏆</div>
            <h3>Average Marks</h3>
            <h1>{averageMarks}%</h1>
            <p>Highest Marks: {highestMarks}%</p>
          </div>
        </div>

        {/* STUDENT PERFORMANCE CHART */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "14px",
            marginTop: "25px",
            marginBottom: "25px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.07)",
          }}
        >
          <h2 style={{ color: "#172554" }}>
            📈 Student Performance Overview
          </h2>

          <p style={{ color: "#64748b" }}>
            Student-wise academic marks comparison
          </p>

          {students.map((student) => (
            <div key={student.id} style={{ marginTop: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  marginBottom: "7px",
                }}
              >
                <strong>{student.name}</strong>
                <strong>{Number(student.marks || 0)}%</strong>
              </div>

              <div
                style={{
                  height: "13px",
                  background: "#e2e8f0",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, Number(student.marks || 0))
                    )}%`,
                    height: "100%",
                    background: "#4f46e5",
                    borderRadius: "20px",
                    transition: "width 0.5s",
                  }}
                />
              </div>
            </div>
          ))}

          {students.length === 0 && (
            <p>No student records available.</p>
          )}
        </div>

        {/* MANAGEMENT BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            margin: "28px 0",
          }}
        >
          <button
            onClick={() => setShowExams(true)}
            style={{
              ...buttonStyle,
              background: "#7c3aed",
              color: "white",
            }}
          >
            Manage Exams
          </button>

          <button
            onClick={() => setShowResults(true)}
            style={{
              ...buttonStyle,
              background: "#059669",
              color: "white",
            }}
          >
            View All Results
          </button>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            style={{
              ...buttonStyle,
              background: "#2563eb",
              color: "white",
            }}
          >
            + Add New Student
          </button>
        </div>

        {/* ADD / EDIT STUDENT FORM */}
        {showForm && (
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              marginBottom: "25px",
              boxShadow: "0 3px 12px #00000012",
            }}
          >
            <h2>
              {editId ? "Edit Student" : "Add New Student"}
            </h2>

            <form onSubmit={handleSubmit}>
              <label>Student Name</label>

              <input
                style={inputStyle}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter student name"
                required
              />

              <label>Roll Number</label>

              <input
                style={inputStyle}
                name="roll"
                value={formData.roll}
                onChange={handleChange}
                placeholder="Enter roll number"
                required
              />

              <label>Email</label>

              <input
                style={inputStyle}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />

              <label>Student Password</label>

              <input
                style={inputStyle}
                name="studentPassword"
                value={formData.studentPassword}
                onChange={handleChange}
                placeholder="Enter student password"
                required
              />

              <label>Course</label>

              <select
                style={inputStyle}
                name="course"
                value={formData.course}
                onChange={handleChange}
              >
                <option value="BCA">BCA</option>
                <option value="BBA">BBA</option>
                <option value="MCA">MCA</option>
              </select>

              <label>Marks</label>

              <input
                style={inputStyle}
                type="number"
                name="marks"
                value={formData.marks}
                onChange={handleChange}
                placeholder="Enter marks"
                min="0"
                max="100"
              />

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="submit"
                  style={{
                    ...buttonStyle,
                    background: "#2563eb",
                    color: "white",
                  }}
                >
                  {editId ? "Update Student" : "Save Student"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    ...buttonStyle,
                    background: "#64748b",
                    color: "white",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STUDENT RECORDS */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 3px 12px #00000012",
          }}
        >
          <h2 style={{ color: "#172554" }}>
            Student Records
          </h2>

          <input
            style={{
              ...inputStyle,
              maxWidth: "400px",
            }}
            type="text"
            placeholder="Search by name, roll number or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "750px",
              }}
            >
              <thead>
                <tr style={{ background: "#dbeafe" }}>
                  {[
                    "Sl. No.",
                    "Student Name",
                    "Roll Number",
                    "Course",
                    "Marks",
                    "Email",
                    "Actions",
                  ].map((heading) => (
                    <th style={thStyle} key={heading}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student.id}>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={tdStyle}>{student.name}</td>
                    <td style={tdStyle}>{student.roll}</td>
                    <td style={tdStyle}>{student.course}</td>
                    <td style={tdStyle}>{student.marks}</td>
                    <td style={tdStyle}>{student.email}</td>

                    <td style={tdStyle}>
                      <button
                        onClick={() => handleEdit(student)}
                        style={{
                          ...buttonStyle,
                          background: "#f59e0b",
                          color: "white",
                          marginRight: "6px",
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(student.id)}
                        style={{
                          ...buttonStyle,
                          background: "#ef4444",
                          color: "white",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="7" style={tdStyle}>
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// CARD STYLE
const cardStyle = (background) => ({
  background,
  color: "white",
  padding: "22px",
  borderRadius: "12px",
  boxShadow: "0 3px 10px #00000015",
});

// TABLE HEADER STYLE
const thStyle = {
  padding: "13px",
  textAlign: "left",
  border: "1px solid #e2e8f0",
  whiteSpace: "nowrap",
};

// TABLE CELL STYLE
const tdStyle = {
  padding: "12px",
  border: "1px solid #e2e8f0",
  fontSize: "14px",
};

export default AdminDashboard;
