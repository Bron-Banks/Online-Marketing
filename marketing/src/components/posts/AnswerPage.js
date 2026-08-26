import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getQuestionsForPost, answerQuestion } from "../../datasource/api-questions";
import { getToken } from "../auth/auth-helper";
import {jwtDecode} from "jwt-decode";

const getUserIdFromToken = () => {
  const token = getToken();
  if (token) {
    const decodedToken = jwtDecode(token);
    return decodedToken.id;
  }
  return null;
};

const AnswerPage = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [questionsCount, setQuestionsCount] = useState(0);
  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const fetchedQuestions = await getQuestionsForPost(id);
        if (Array.isArray(fetchedQuestions)) {
          setQuestions(fetchedQuestions);
          setQuestionsCount(fetchedQuestions.filter((q) => !q.answer).length);
        } else {
          setQuestions([]);
          setQuestionsCount(0);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setQuestions([]);
        setQuestionsCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [id]);

  const handleAnswerSubmit = async (questionId) => {
    const answer = answers[questionId];
    if (!answer) {
      alert("Please provide an answer before submitting.");
      return;
    }
    try {
      const response = await answerQuestion(questionId, answer);
      if (response?.success) {
        alert("Answer submitted successfully.");
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q._id === questionId ? { ...q, answer } : q
          )
        );
        setQuestionsCount((prevCount) => prevCount - 1);
      } else {
        alert(response?.message || "Failed to submit the answer.");
      }
    } catch (error) {
      console.error("Error submitting the answer:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <main className="container" style={{ paddingTop: 96, paddingBottom: 40 }}>
      <h1>Answer Questions for Your Post</h1>
      <p className="page-subtitle">Total Questions Remaining: {questionsCount}</p>
      {isLoading && <div className="loading-state">Loading questions...</div>}

      {!isLoading && questions.length > 0 ? (
        <div>
          {questions.map((question) => (
            <div key={question._id} className="details-card" style={{ marginBottom: 16, flex: "none" }}>
              <div>
                <p style={{ margin: 0 }}>
                  <strong>{question.askedBy || "Anonymous"}</strong> asked:
                </p>
                <p style={{ marginTop: 4 }}>{question.question}</p>
                {question.answer ? (
                  <div className="detail-row">
                    <div className="detail-label">Answer</div>
                    <p style={{ margin: 0 }}>{question.answer}</p>
                  </div>
                ) : userId === question.post.owner ? (
                  <div>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Enter your answer here..."
                      value={answers[question._id] || ""}
                      onChange={(e) =>
                        setAnswers({ ...answers, [question._id]: e.target.value })
                      }
                    ></textarea>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={() => handleAnswerSubmit(question._id)}
                    >
                      Submit Answer
                    </button>
                  </div>
                ) : (
                  <p className="page-subtitle" style={{ marginBottom: 0 }}>
                    Only the post owner can answer this question.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">No questions available for this post.</div>
      )}
    </main>
  );
};

export default AnswerPage;
