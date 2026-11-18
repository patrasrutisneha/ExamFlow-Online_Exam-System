
import { useState } from "react";

function AdminResults({ onBack }) {
  const [results] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("examflow_results") || "[]"
      );

      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const getPercentage = (result) => {
    if (result.percentage !== undefined) {
      return Number(result.percentage);
    }

    return result.total
      ? (Number(result.score) / Number(result.total)) * 100
      : 0;
  };

  // Support both old and new date/time field names
  const getExamDate = (result) => {
    return result.examDate || result.date || "Not Available";
  };

  const getExamTime = (result) => {
    return result.examTime || result.time || "Not Available";
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="admin-results-page">
      <style>{`
        .admin-results-page {
          padding: 30px;
          background: #f1f5f9;
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 25px;
        }

        .results-header h2 {
          color: #4338ca;
          margin: 0;
        }

        .results-buttons {
          display: flex;
          gap: 10px;
        }

        .results-buttons button {
          padding: 11px 18px;
          border: none;
          border-radius: 7px;
          cursor: pointer;
          color: white;
          font-weight: bold;
        }

        .back-btn {
          background: #64748b;
        }

        .pdf-btn {
          background: #4338ca;
        }

        .results-table-container {
          overflow-x: auto;
          background: white;
          padding: 20px;
          border-radius: 12px;
        }

        .results-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 950px;
        }

        .results-table th,
        .results-table td {
          padding: 13px 10px;
          border: 1px solid #e2e8f0;
          text-align: center;
          font-size: 13px;
        }

        .results-table th {
          background: #4338ca;
          color: white;
        }

        .pass {
          color: green;
          font-weight: bold;
        }

        .fail {
          color: red;
          font-weight: bold;
        }

        .no-results {
          text-align: center;
          padding: 30px;
          color: #64748b;
        }

        @media print {
          body {
            background: white !important;
          }

          .admin-results-page {
            padding: 5px;
            background: white !important;
          }

          .print-hidden {
            display: none !important;
          }

          .results-table-container {
            padding: 0;
            overflow: visible;
          }

          .results-table {
            min-width: 100%;
          }

          .results-table th,
          .results-table td {
            font-size: 9px;
            padding: 7px 4px;
          }
        }
      `}</style>

      <div className="results-header">
        <h2>Student Examination Results</h2>

        <div className="results-buttons print-hidden">
          <button className="back-btn" onClick={onBack}>
            Back
          </button>

          <button className="pdf-btn" onClick={handleDownloadPDF}>
            Download Result as PDF
          </button>
        </div>
      </div>

      <div className="results-table-container">
        {results.length === 0 ? (
          <div className="no-results">
            <h3>No Results Available</h3>
            <p>Students have not submitted any exams yet.</p>
          </div>
        ) : (
          <table className="results-table">
            <thead>
              <tr>
                <th>Sl. No.</th>
                <th>Student Name</th>
                <th>Roll Number</th>
                <th>Course</th>
                <th>Exam Name</th>
                <th>Exam Date</th>
                <th>Exam Time</th>
                <th>Obtained</th>
                <th>Total</th>
                <th>Percentage</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {results.map((result, index) => {
                const percentage = getPercentage(result);
                const passed = percentage >= 50;

                return (
                  <tr key={result.id || index}>
                    <td>{index + 1}</td>

                    <td>
                      {result.studentName || "Not Available"}
                    </td>

                    <td>
                      {result.studentRoll || "Not Available"}
                    </td>

                    <td>
                      {result.studentCourse || "Not Available"}
                    </td>

                    <td>
                      {result.examName || "Not Available"}
                    </td>

                    <td>{getExamDate(result)}</td>

                    <td>{getExamTime(result)}</td>

                    <td>{result.score ?? 0}</td>

                    <td>{result.total ?? 0}</td>

                    <td>{percentage.toFixed(2)}%</td>

                    <td className={passed ? "pass" : "fail"}>
                      {passed ? "PASS" : "FAIL"}
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

export default AdminResults;
