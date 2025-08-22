const express = require('express');
const Question = require('../models/Question');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Test route (no auth required)
router.get('/test', (req, res) => {
  res.json({ message: 'Exam routes are working!' });
});

// Get random questions for exam
router.get('/questions', auth, async (req, res) => {
  try {
    console.log('📋 Questions endpoint called by user:', req.userId);
    const questionsCount = parseInt(req.query.count) || 10;
    console.log(`Requesting ${questionsCount} questions`);
    
    // Check if any questions exist
    const totalQuestions = await Question.countDocuments();
    console.log(`📊 Total questions in database: ${totalQuestions}`);
    
    if (totalQuestions === 0) {
      console.log('❌ No questions found in database');
      return res.status(200).json([]);  // Return empty array instead of error
    }

    // Get random questions
    const sampleSize = Math.min(questionsCount, totalQuestions);
    console.log(`🎲 Fetching ${sampleSize} random questions`);

    const questions = await Question.aggregate([
      { $sample: { size: sampleSize } }
    ]);

    console.log(`✅ Successfully retrieved ${questions.length} questions`);

    // Remove correct answers from response
    const questionsWithoutAnswers = questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
    }));

    console.log('📤 Sending questions to frontend');
    res.json(questionsWithoutAnswers);

  } catch (error) {
    console.error('❌ Error fetching questions:', error);
    res.status(500).json({ message: 'Server error fetching questions', error: error.message });
  }
});

// Submit exam
router.post('/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    
    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });
    
    let score = 0;
    const results = answers.map(answer => {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      const isCorrect = question && question.correctAnswer === answer.selectedAnswer;
      if (isCorrect) score++;
      
      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question ? question.correctAnswer : null,
        isCorrect,
      };
    });

    const user = await User.findById(req.userId);
    user.examResults.push({
      examId: new Date().toISOString(),
      score,
      totalQuestions: answers.length,
      completedAt: new Date(),
    });
    await user.save();

    res.json({
      score,
      totalQuestions: answers.length,
      percentage: Math.round((score / answers.length) * 100),
      results,
    });
  } catch (error) {
    console.error('Error submitting exam:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
