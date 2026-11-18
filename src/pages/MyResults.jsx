
function MyResults({ results = [], onBack }) {
  const totalExams = results.length;

  const totalObtained = results.reduce(
    (sum, result) => sum + Number(result.score || 0),
    0
  );

  const totalPossible = results.reduce(
    (sum, result) => sum + Number(result.total || 0),
    0
  );

  const averagePercentage =
    totalPossible > 0
      ? Math.round((totalObtained / totalPossible) * 100)
      : 0;

  const passedExams = results.filter(
    (result) =>
      Number(result.percentage ?? (
        result.total > 0
          ? (result.score / result.total) * 100
          : 0
      )) >= 50
  ).length;

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={{ color: "#4338ca" }}>ExamFlow</h1>

        <button onClick={onBack} style={buttonStyle}>
          Back to Dashboard
        </button>
      </div>

      <h2 style={{ marginTop: "35px" }}>My Results</h2>
      <p style={{ color: "#64748b" }}>
        Check your examination performance here.
      </p>

      <div style={cardsContainer}>
        <div style={cardStyle}>
          <h3>Total Exams</h3>
          <h1>{totalExams}</h1>
        </div>

        <div style={cardStyle}>
          <h3>Total Marks Obtained</h3>
          <h1>{totalObtained}</h1>
          <p>Out of {totalPossible} marks</p>
        </div>

        <div style={cardStyle}>
          <h3>Average Percentage</h3>
          <h1>{averagePercentage}%</h1>
        </div>

        <div style={cardStyle}>
          <h3>Passed Exams</h3>
          <h1 style={{ color: "green" }}>{passedExams}</h1>
        </div>
      </div>

      <div style={tableCardStyle}>
        <h3>Examination History</h3>

        {totalExams === 0 ? (
          <p style={{ color: "#64748b", marginTop: "20px" }}>
            No exam results available yet. Please attend an exam first.
          </p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#eef2ff" }}>
                <th style={cellStyle}>Exam Name</th>
                <th style={cellStyle}>Obtained Marks</th>
                <th style={cellStyle}>Total Marks</th>
                <th style={cellStyle}>Percentage</th>
                <th style={cellStyle}>Status</th>
              </tr>
            </thead>

            <tbody>
              {results.map((result, index) => {
                const score = Number(result.score || 0);
                const total = Number(result.total || 0);

                const percentage = Number(
                  result.percentage ??
                    (total > 0 ? (score / total) * 100 : 0)
                );

                const passed = percentage >= 50;

                return (
                  <tr key={index}>
                    <td style={cellStyle}>{result.examName}</td>
                    <td style={cellStyle}>{score}</td>
                    <td style={cellStyle}>{total}</td>
                    <td style={cellStyle}>
                      {percentage.toFixed(0)}%
                    </td>
                    <td style={cellStyle}>
                      <span
                        style={{
                          color: passed ? "green" : "red",
                          fontWeight: "bold"
                        }}
                      >
                        {passed ? "PASS" : "FAIL"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#f1f5f9",
  padding: "30px"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "15px"
};

const buttonStyle = {
  padding: "11px 20px",
  background: "#4338ca",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const cardsContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "20px",
  marginTop: "25px"
};

const cardStyle = {
  background: "white",
  padding: "22px",
  borderRadius: "12px",
  flex: 1,
  minWidth: "180px",
  boxShadow: "0 3px 12px rgba(0,0,0,0.08)"
};

const tableCardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  marginTop: "30px",
  overflowX: "auto"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
  textAlign: "left"
};

const cellStyle = {
  padding: "13px",
  borderBottom: "1px solid #e2e8f0"
};

export default MyResults;
