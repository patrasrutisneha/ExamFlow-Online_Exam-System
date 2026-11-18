
import { useState, useEffect, useMemo, useCallback } from "react";

import {
  webQuestions,
  dbmsQuestions,
  networkQuestions,
  pythonQuestions,
  cQuestions,
  javaQuestions,
  osQuestions,
  fundamentalsQuestions,
  softwareEngineeringQuestions,
  cyberQuestions,
  dataStructuresQuestions,
  computerOrganizationQuestions,
  digitalElectronicsQuestions,
  artificialIntelligenceQuestions,
  machineLearningQuestions,
  dataAnalyticsQuestions,
  graphicsQuestions,
  cloudQuestions,
  iotQuestions,
  mathematicsQuestions
} from "./questionBank";

const subjectQuestionBank = [
  { keywords: ["web development", "html", "css", "javascript"], questions: webQuestions },
  { keywords: ["database management", "dbms", "sql"], questions: dbmsQuestions },
  { keywords: ["computer networks", "networking"], questions: networkQuestions },
  { keywords: ["python"], questions: pythonQuestions },
  { keywords: ["c programming", "c language"], questions: cQuestions },
  { keywords: ["java"], questions: javaQuestions },
  { keywords: ["operating system", "operating systems"], questions: osQuestions },
  { keywords: ["computer fundamentals", "basic computer", "ms office"], questions: fundamentalsQuestions },
  { keywords: ["software engineering", "sdlc"], questions: softwareEngineeringQuestions },
  { keywords: ["cyber security", "cybersecurity", "internet security"], questions: cyberQuestions },
  { keywords: ["data structures", "dsa", "algorithms"], questions: dataStructuresQuestions },
  { keywords: ["computer organization", "coa"], questions: computerOrganizationQuestions },
  { keywords: ["digital electronics", "logic gates"], questions: digitalElectronicsQuestions },
  { keywords: ["artificial intelligence", "ai basics"], questions: artificialIntelligenceQuestions },
  { keywords: ["machine learning", "ml fundamentals"], questions: machineLearningQuestions },
  { keywords: ["data analytics", "data analysis", "excel"], questions: dataAnalyticsQuestions },
  { keywords: ["computer graphics", "graphics"], questions: graphicsQuestions },
  { keywords: ["cloud computing", "cloud fundamentals"], questions: cloudQuestions },
  { keywords: ["internet of things", "iot"], questions: iotQuestions },
  { keywords: ["mathematics", "discrete mathematics"], questions: mathematicsQuestions }
];

function getQuestionsForExam(exam) {
  const searchText = `${exam?.title || ""} ${exam?.subject || ""}`.toLowerCase();

  const matchedSubject = subjectQuestionBank.find((item) =>
    item.keywords.some((keyword) => searchText.includes(keyword))
  );

  const selectedQuestions = matchedSubject?.questions || webQuestions;

  return selectedQuestions.map((item, index) => ({
    id: index + 1,
    question: item[0],
    options: item[1],
    answer: item[2]
  }));
}

function ExamPage({ exam, onBack, onSubmit }) {
  const questions = useMemo(
    () => getQuestionsForExam(exam),
    [exam]
  );

  const durationMatch = String(exam?.duration || "30").match(/\d+/);
  const duration = Math.max(1, Number(durationMatch?.[0]) || 30);
  const totalMarks = Math.max(1, Number(exam?.marks) || 20);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [submitted, setSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const handleSubmit = useCallback(() => {
    if (submitted) return;

    const correctAnswers = questions.reduce((total, question, index) => {
      return total + (answers[index] === question.answer ? 1 : 0);
    }, 0);

    const score = Number(
      ((correctAnswers / questions.length) * totalMarks).toFixed(2)
    );

    const resultPercentage = Number(
      ((score / totalMarks) * 100).toFixed(2)
    );

    setFinalScore(score);
    setPercentage(resultPercentage);
    setSubmitted(true);

    if (typeof onSubmit === "function") {
      onSubmit({
        examName: exam?.title || "Practice Exam",
        score: score,
        total: totalMarks,
        percentage: resultPercentage
      });
    }
  }, [submitted, questions, answers, totalMarks, onSubmit, exam]);

  // Automatic countdown timer
  useEffect(() => {
    if (submitted) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, submitted, handleSubmit]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const selectAnswer = (optionIndex) => {
    setAnswers((previous) => ({
      ...previous,
      [current]: optionIndex
    }));
  };

  const answeredCount = Object.keys(answers).length;
  const currentQuestion = questions[current];

  // Result screen
  if (submitted) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "30px",
        fontFamily: "Arial"
      }}>
        <div style={{
          maxWidth: "650px",
          margin: "40px auto",
          background: "white",
          padding: "35px",
          borderRadius: "18px",
          textAlign: "center",
          boxShadow: "0 5px 20px rgba(0,0,0,0.08)"
        }}>
          <h1 style={{ color: "#4338ca" }}>Exam Completed!</h1>

          <p style={{ color: "#64748b" }}>
            {exam?.title || "Practice Exam"}
          </p>

          <div style={{
            margin: "30px auto",
            padding: "25px",
            background: "#eef2ff",
            borderRadius: "15px"
          }}>
            <h2 style={{ color: "#4338ca", fontSize: "38px" }}>
              {finalScore} / {totalMarks}
            </h2>

            <h3 style={{ color: "#1e293b" }}>
              {percentage}% Score
            </h3>
          </div>

          <p style={{ color: "#475569" }}>
            Correct answers: {questions.reduce(
              (total, question, index) =>
                total + (answers[index] === question.answer ? 1 : 0),
              0
            )} / {questions.length}
          </p>

          <p style={{ color: "#475569" }}>
            Answered questions: {answeredCount} / {questions.length}
          </p>

          <h2 style={{
            color: percentage >= 50 ? "#16a34a" : "#dc2626"
          }}>
            {percentage >= 50 ? "PASS" : "FAIL"}
          </h2>

          <button
            onClick={onBack}
            style={{
              marginTop: "20px",
              padding: "13px 30px",
              background: "#4338ca",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Question screen
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f1f5f9",
      padding: "25px",
      fontFamily: "Arial"
    }}>
      <div style={{
        maxWidth: "900px",
        margin: "auto"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px"
        }}>
          <div>
            <h1 style={{ color: "#4338ca" }}>ExamFlow</h1>
            <h2 style={{ color: "#1e293b" }}>
              {exam?.title || "Practice Exam"}
            </h2>
          </div>

          <div style={{
            background: timeLeft <= 60 ? "#fee2e2" : "#e0e7ff",
            color: timeLeft <= 60 ? "#dc2626" : "#4338ca",
            padding: "15px 22px",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "20px"
          }}>
            ⏱️ {formatTime(timeLeft)}
          </div>
        </div>

        <div style={{
          background: "white",
          padding: "18px",
          borderRadius: "12px",
          marginTop: "20px"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#475569",
            marginBottom: "10px"
          }}>
            <span>Question {current + 1} of {questions.length}</span>
            <span>{answeredCount} Answered</span>
          </div>

          <div style={{
            height: "9px",
            background: "#e2e8f0",
            borderRadius: "10px",
            overflow: "hidden"
          }}>
            <div style={{
              width: `${((current + 1) / questions.length) * 100}%`,
              height: "100%",
              background: "#6366f1",
              transition: "width 0.3s"
            }} />
          </div>
        </div>

        <div style={{
          background: "white",
          padding: "28px",
          borderRadius: "15px",
          marginTop: "20px",
          boxShadow: "0 3px 12px rgba(0,0,0,0.06)"
        }}>
          <h3 style={{
            color: "#1e293b",
            lineHeight: "1.6",
            marginBottom: "25px"
          }}>
            Q{current + 1}. {currentQuestion.question}
          </h3>

          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => selectAnswer(index)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "15px",
                marginBottom: "12px",
                borderRadius: "9px",
                border: answers[current] === index
                  ? "2px solid #4338ca"
                  : "1px solid #cbd5e1",
                background: answers[current] === index
                  ? "#eef2ff"
                  : "white",
                color: "#1e293b",
                cursor: "pointer",
                fontSize: "15px"
              }}
            >
              {String.fromCharCode(65 + index)}. {option}
              {answers[current] === index ? "  ✓" : ""}
            </button>
          ))}

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "25px"
          }}>
            <button
              disabled={current === 0}
              onClick={() => setCurrent((previous) => previous - 1)}
              style={{
                padding: "12px 22px",
                background: current === 0 ? "#cbd5e1" : "#64748b",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: current === 0 ? "not-allowed" : "pointer"
              }}
            >
              ← Previous
            </button>

            {current < questions.length - 1 ? (
              <button
                onClick={() => setCurrent((previous) => previous + 1)}
                style={{
                  padding: "12px 25px",
                  background: "#4338ca",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                style={{
                  padding: "12px 25px",
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Submit Exam
              </button>
            )}
          </div>
        </div>

        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginTop: "20px"
        }}>
          <h3 style={{ color: "#1e293b" }}>Question Navigator</h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(42px, 1fr))",
            gap: "9px",
            marginTop: "15px"
          }}>
            {questions.map((question, index) => (
              <button
                key={question.id}
                onClick={() => setCurrent(index)}
                style={{
                  padding: "10px",
                  border: "none",
                  borderRadius: "7px",
                  background: answers[index] !== undefined
                    ? "#16a34a"
                    : current === index
                      ? "#4338ca"
                      : "#e2e8f0",
                  color: answers[index] !== undefined || current === index
                    ? "white"
                    : "#1e293b",
                  cursor: "pointer"
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "15px",
            marginTop: "20px",
            background: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "9px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Submit Exam
        </button>
      </div>
    </div>
  );
}

export default ExamPage;
