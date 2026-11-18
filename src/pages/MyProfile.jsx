
function MyProfile({ student, onBack }) {
  const currentStudent = student || {
    name: "Student",
    roll: "",
    course: "BCA",
    marks: 0,
    email: ""
  };

  const profileStyle = {
    background: "white",
    padding: "22px",
    borderRadius: "12px",
    marginBottom: "15px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.06)"
  };

  const labelStyle = {
    color: "#64748b",
    fontSize: "14px",
    marginBottom: "6px"
  };

  const valueStyle = {
    color: "#1e293b",
    fontSize: "17px",
    fontWeight: "bold"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "30px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px"
        }}
      >
        <h1 style={{ color: "#4338ca" }}>ExamFlow</h1>

        <button
          onClick={onBack}
          style={{
            padding: "11px 20px",
            background: "#4338ca",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Back to Dashboard
        </button>
      </div>

      <div style={{ maxWidth: "750px", margin: "35px auto" }}>
        <h2>My Profile</h2>

        <p style={{ color: "#64748b", marginBottom: "25px" }}>
          View your personal and academic information.
        </p>

        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "15px",
            textAlign: "center",
            marginBottom: "25px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.06)"
          }}
        >
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "#4338ca",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "auto",
              fontSize: "35px",
              fontWeight: "bold"
            }}
          >
            {(currentStudent.name || "S").charAt(0).toUpperCase()}
          </div>

          <h2 style={{ marginTop: "15px" }}>
            {currentStudent.name}
          </h2>

          <p style={{ color: "#64748b" }}>
            {currentStudent.course || "BCA"} Student
          </p>
        </div>

        <div style={profileStyle}>
          <p style={labelStyle}>Student Name</p>
          <p style={valueStyle}>{currentStudent.name}</p>
        </div>

        <div style={profileStyle}>
          <p style={labelStyle}>Roll Number</p>
          <p style={valueStyle}>{currentStudent.roll || "Not Available"}</p>
        </div>

        <div style={profileStyle}>
          <p style={labelStyle}>Email</p>
          <p style={valueStyle}>{currentStudent.email || "Not Available"}</p>
        </div>

        <div style={profileStyle}>
          <p style={labelStyle}>Course</p>
          <p style={valueStyle}>{currentStudent.course || "BCA"}</p>
        </div>

        <div style={profileStyle}>
          <p style={labelStyle}>Marks</p>
          <p style={valueStyle}>
            {currentStudent.marks ?? "Not Available"}
            {currentStudent.marks !== undefined ? "%" : ""}
          </p>
        </div>

        <div style={profileStyle}>
          <p style={labelStyle}>Semester</p>
          <p style={valueStyle}>5th Semester</p>
        </div>

        <div style={profileStyle}>
          <p style={labelStyle}>College Name</p>
          <p style={valueStyle}>
            Sparsh College of Computer and Management
          </p>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
            padding: "20px",
            color: "#64748b"
          }}
        >
          © 2026 ExamFlow | Student Profile
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
