import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Exam() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/exam/questions?count=10', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        if (response.data && response.data.length > 0) {
          setQuestions(response.data);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      }
    };
    fetchQuestions();
  }, [navigate]);

  // Countdown timer + auto-submit
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleSubmit(); // auto-submit when time expires
    }
    // eslint-disable-next-line
  }, [timeLeft]);

  // Centralized submit handler (manual and auto)
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const formattedAnswers = Object.keys(answers).map(questionId => ({
        questionId,
        selectedAnswer: answers[questionId]
      }));

      console.log('Submitting exam with answers:', formattedAnswers);
      console.log('Total answers submitted:', formattedAnswers.length);

      const response = await axios.post(
        'http://localhost:5000/api/exam/submit',
        { answers: formattedAnswers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Exam submitted successfully:', response.data);
      console.log('Result data to pass:', response.data);

      // Store in sessionStorage as backup
      sessionStorage.setItem('examResult', JSON.stringify(response.data));

      // Navigate to results page with score data
      navigate('/results', { 
        state: response.data,
        replace: true // Prevent returning to the exam
      });

      console.log('Navigated to results page');
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Error submitting exam. Please try again.');
      setSubmitting(false);
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex,
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading exam questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="alert alert-warning text-center">
        <h4>No questions available</h4>
        <p>Please contact administrator or check browser console for details.</p>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="row justify-content-center">
      <div className="col-md-10">

        {/* Timer and Progress */}
        <div className="card mb-3">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="progress">
                  <div
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                  >
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                </div>
              </div>
              <div className="col-md-6 text-end">
                <h5 className={`mb-0 ${timeLeft < 300 ? 'text-danger' : 'text-primary'}`}>
                  Time Left: {formatTime(timeLeft)}
                </h5>
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">
              Question {currentQuestionIndex + 1}
            </h4>
            <p className="card-text lead">{currentQuestion.question}</p>
            <div className="mt-4">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`question-${currentQuestion._id}`}
                    id={`option-${index}`}
                    checked={answers[currentQuestion._id] === index}
                    onChange={() => handleAnswerSelect(currentQuestion._id, index)}
                  />
                  <label className="form-check-label" htmlFor={`option-${index}`}>
                    {option}
                  </label>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              <div>
                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Exam'}
                  </button>
                )}
              </div>
            </div>

            {/* Question Navigator */}
            <div className="mt-4">
              <h6>Quick Navigation:</h6>
              <div className="d-flex flex-wrap gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    className={`btn btn-sm ${
                      index === currentQuestionIndex
                        ? 'btn-primary'
                        : answers[questions[index]._id] !== undefined
                        ? 'btn-success'
                        : 'btn-outline-secondary'
                    }`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Exam;
