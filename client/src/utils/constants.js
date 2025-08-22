export const EXAM_CONFIG = {
  DURATION: 30 * 60, // 30 minutes in seconds
  QUESTIONS_COUNT: 10,
  PASSING_SCORE: 60,
};

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  EXAM: '/exam',
  RESULTS: '/results',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  EXAM: {
    QUESTIONS: '/exam/questions',
    SUBMIT: '/exam/submit',
  },
};

export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login successful!',
    REGISTER: 'Registration successful!',
    EXAM_SUBMIT: 'Exam submitted successfully!',
  },
  ERROR: {
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
    REGISTER_FAILED: 'Registration failed. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    EXAM_SUBMIT_FAILED: 'Failed to submit exam. Please try again.',
  },
};
