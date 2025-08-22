import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

function Results() {
  const location = useLocation();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let data = location.state;

    // Fallback to sessionStorage if state is missing (for View Results or refresh)
    if (!data) {
      const storedResult = sessionStorage.getItem('examResult');
      if (storedResult) {
        data = JSON.parse(storedResult);
      }
    }

    setResultData(data || null);
    setLoading(false);
  }, [location.state]);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading results...</p>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="alert alert-info text-center">
            <h4>No exam results found</h4>
            <p>Please take an exam first to see your results.</p>
            <div className="mt-3">
              <Link to="/dashboard" className="btn btn-primary me-2">
                Go to Dashboard
              </Link>
              <Link to="/exam" className="btn btn-success">
                Take Exam Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { score, totalQuestions, percentage } = resultData;

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-danger';
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 80) return 'Excellent! Well done!';
    if (percentage >= 60) return 'Good job! Keep improving!';
    return 'Keep practicing! You can do better!';
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-body text-center">
            <h1 className="card-title text-primary mb-4">Exam Results</h1>

            {/* Equal height and width for each result card using Bootstrap flex utilities */}
            <div className="row mb-4">
              <div className="col-md-4 d-flex">
                <div className="card bg-light h-100 w-100">
                  <div className="card-body d-flex flex-column justify-content-center align-items-center">
                    <h5 className="card-title">Score</h5>
                    <h2 className={getScoreColor(percentage)}>
                      {score}/{totalQuestions}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="col-md-4 d-flex">
                <div className="card bg-light h-100 w-100">
                  <div className="card-body d-flex flex-column justify-content-center align-items-center">
                    <h5 className="card-title">Percentage</h5>
                    <h2 className={getScoreColor(percentage)}>
                      {percentage}%
                    </h2>
                  </div>
                </div>
              </div>

              <div className="col-md-4 d-flex">
                <div className="card bg-light h-100 w-100">
                  <div className="card-body d-flex flex-column justify-content-center align-items-center">
                    <h5 className="card-title">Status</h5>
                    <h6 className={getScoreColor(percentage)}>
                      {percentage >= 60 ? 'PASSED' : 'FAILED'}
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            <div className="alert alert-info mb-4">
              <h5>{getScoreMessage(percentage)}</h5>
            </div>

            <div className="progress mb-4" style={{ height: '25px' }}>
              <div
                className={`progress-bar ${
                  percentage >= 80 
                    ? 'bg-success' 
                    : percentage >= 60 
                    ? 'bg-warning' 
                    : 'bg-danger'
                }`}
                style={{ width: `${percentage}%` }}
              >
                {percentage}%
              </div>
            </div>

            <div className="mt-4">
              <Link to="/dashboard" className="btn btn-primary me-3">
                Back to Dashboard
              </Link>
              <Link to="/exam" className="btn btn-success">
                Take Another Exam
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;
