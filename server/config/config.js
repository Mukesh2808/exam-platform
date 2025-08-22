require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/exam-platform',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '24h',
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Exam configuration
  EXAM_DURATION: 30 * 60, // 30 minutes in seconds
  QUESTIONS_PER_EXAM: 10,
  PASSING_SCORE: 60, // percentage
};
