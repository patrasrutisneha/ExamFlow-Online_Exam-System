
import { useState } from "react";

// Default exams
const defaultExams = [
  {
    id: 1,
    title: "Web Development",
    subject: "HTML, CSS & JavaScript",
    duration: 30,
    marks: 20,
  },
  {
    id: 2,
    title: "Database Management",
    subject: "DBMS & SQL",
    duration: 45,
    marks: 20,
  },
  {
    id: 3,
    title: "Computer Networks",
    subject: "Networking Fundamentals",
    duration: 30,
    marks: 20,
  },
];

function getSavedExams() {
  try {
    const savedExams = localStorage.getItem("examflow_exams");

    if (savedExams !== null) {
      return JSON.parse(savedExams);
    }

    return defaultExams;
  } catch (error) {
    console.error("Unable to load exams:", error);
    return defaultExams;
  }
}

function ExamManagement({ onBack }) {
  const [exams, setExams] = useState(getSavedExams);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("");
  const [marks, setMarks] = useState("");
  const [editId, setEditId] = useState(null);

  // Save exams in browser storage
  const saveExams = (updatedExams) => {
    setExams(updatedExams);
    localStorage.setItem(
      "examflow_exams",
      JSON.stringify(updatedExams)
    );
  };

  const resetForm = () => {
    setTitle("");
    setSubject("");
    setDuration("");
    setMarks("");
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !subject.trim() ||
      !duration ||
      !marks
    ) {
      alert("Please fill all fields!");
      return;
    }

    if (Number(duration) < 1 || Number(marks) < 1) {
      alert("Duration and marks must be greater than zero!");
      return;
    }

    const examData = {
      id: editId !== null ? editId : Date.now(),
      title: title.trim(),
      subject: subject.trim(),
      duration: Number(duration),
      marks: Number(marks),
    };

    if (editId !== null) {
      const updatedExams = exams.map((exam) =>
        exam.id === editId ? examData : exam
      );

      saveExams(updatedExams);
      alert("Exam updated successfully!");
    } else {
      const updatedExams = [...exams, examData];

      saveExams(updatedExams);
      alert("New exam added successfully!");
    }

    resetForm();
  };

  const handleEdit = (exam) => {
    setEditId(exam.id);
    setTitle(exam.title);
    setSubject(exam.subject);
    setDuration(String(exam.duration));
    setMarks(String(exam.marks));

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      const updatedExams = exams.filter(
        (exam) => exam.id !== id
      );

      saveExams(updatedExams);
      alert("Exam deleted successfully!");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1>Exam Management</h1>
          <p>Add, edit and manage examinations</p>
        </div>

        <button
          style={styles.backButton}
          onClick={onBack}
        >
          Back to Dashboard
        </button>
      </div>

      <div style={styles.formCard}>
        <h2>
          {editId !== null ? "Update Exam" : "Add New Exam"}
        </h2>

        <form onSubmit={handleSubmit}>
          <label>Exam Name</label>
          <input
            style={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter exam name"
          />

          <label>Subject Name</label>
          <input
            style={styles.input}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject name"
          />

          <label>Exam Duration (Minutes)</label>
          <input
            style={styles.input}
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Enter duration"
          />

          <label>Total Marks</label>
          <input
            style={styles.input}
            type="number"
            min="1"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            placeholder="Enter total marks"
          />

          <div style={styles.actions}>
            <button type="submit" style={styles.saveButton}>
              {editId !== null ? "Update Exam" : "Add Exam"}
            </button>

            {editId !== null && (
              <button
                type="button"
                style={styles.cancelButton}
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={styles.tableCard}>
        <h2>All Exams ({exams.length})</h2>

        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.cell}>Exam Name</th>
                <th style={styles.cell}>Subject</th>
                <th style={styles.cell}>Duration</th>
                <th style={styles.cell}>Total Marks</th>
                <th style={styles.cell}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td style={styles.cell}>{exam.title}</td>
                  <td style={styles.cell}>{exam.subject}</td>
                  <td style={styles.cell}>{exam.duration} min</td>
                  <td style={styles.cell}>{exam.marks}</td>

                  <td style={styles.cell}>
                    <button
                      style={styles.editButton}
                      onClick={() => handleEdit(exam)}
                    >
                      Edit
                    </button>

                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(exam.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {exams.length === 0 && (
          <p>No exams available.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    background: "#f1f5f9",
    fontFamily: "Arial, sans-serif",
    color: "#1e293b",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "25px",
  },

  backButton: {
    padding: "12px 18px",
    background: "#475569",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  formCard: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    maxWidth: "600px",
    marginBottom: "25px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
  },

  tableCard: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
  },

  input: {
    display: "block",
    width: "100%",
    padding: "12px",
    marginTop: "7px",
    marginBottom: "15px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    boxSizing: "border-box",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },

  saveButton: {
    padding: "12px 22px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
  },

  cancelButton: {
    padding: "12px 22px",
    background: "#64748b",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },

  cell: {
    padding: "12px",
    borderBottom: "1px solid #e2e8f0",
  },

  editButton: {
    padding: "7px 12px",
    marginRight: "6px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  deleteButton: {
    padding: "7px 12px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ExamManagement;
