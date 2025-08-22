import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-body text-center">
            <h1 className="card-title">Welcome to ExamPlatform</h1>
            <p className="card-text lead">
              Hello {user?.name}! Ready to take your exam?
            </p>
            
            <div className="row mt-4">
              <div className="col-md-6 mb-3">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Start New Exam</h5>
                    <p className="card-text">
                      Begin a new exam session with randomized questions.
                    </p>
                    <Link to="/exam" className="btn btn-primary">
                      Start Exam
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">View Results</h5>
                    <p className="card-text">
                      Check your previous exam results and performance.
                    </p>
                    <Link to="/results" className="btn btn-secondary">
                      View Results
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="alert alert-info mt-4" role="alert">
              <strong>Exam Instructions:</strong>
              <ul className="list-unstyled mt-2 mb-0">
                <li>• You will have 30 minutes to complete the exam</li>
                <li>• The exam consists of multiple-choice questions</li>
                <li>• You can navigate between questions using Next/Previous buttons</li>
                <li>• The exam will auto-submit when time expires</li>
                <li>• Make sure you have a stable internet connection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
