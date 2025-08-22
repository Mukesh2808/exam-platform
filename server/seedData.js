const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

const sampleQuestions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "geography"
  },
  {
    question: "Which programming language is known as the 'language of the web'?",
    options: ["Python", "JavaScript", "Java", "C++"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "programming"
  },
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language", 
      "Home Tool Markup Language",
      "Hyperlink and Text Markup Language"
    ],
    correctAnswer: 0,
    difficulty: "easy",
    category: "web-development"
  },
  {
    question: "Which HTTP method is used to retrieve data from a server?",
    options: ["POST", "GET", "PUT", "DELETE"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "web-development"
  },
  {
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
    difficulty: "medium",
    category: "algorithms"
  },
  {
    question: "Which database is known as a NoSQL database?",
    options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
    correctAnswer: 2,
    difficulty: "easy",
    category: "database"
  },
  {
    question: "In React, what hook is used for state management?",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    correctAnswer: 1,
    difficulty: "easy",
    category: "react"
  },
  {
    question: "What is the default port for MongoDB?",
    options: ["3000", "5000", "27017", "8080"],
    correctAnswer: 2,
    difficulty: "medium",
    category: "database"
  },
  {
    question: "Which of the following is NOT a JavaScript framework?",
    options: ["React", "Vue", "Angular", "Laravel"],
    correctAnswer: 3,
    difficulty: "easy",
    category: "programming"
  },
  {
    question: "What does API stand for?",
    options: [
      "Application Programming Interface",
      "Advanced Programming Interface",
      "Application Process Interface",
      "Advanced Process Interface"
    ],
    correctAnswer: 0,
    difficulty: "easy",
    category: "programming"
  }
];

async function seedQuestions() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exam-platform');
    console.log('✅ Connected to MongoDB successfully');

    console.log('🧹 Clearing existing questions...');
    const deleteResult = await Question.deleteMany({});
    console.log(`🗑️ Deleted ${deleteResult.deletedCount} existing questions`);

    console.log('📝 Inserting sample questions...');
    const insertResult = await Question.insertMany(sampleQuestions);
    console.log(`✅ Inserted ${insertResult.length} sample questions successfully`);

    // Verify the data was inserted
    const count = await Question.countDocuments();
    console.log(`📊 Total questions in database: ${count}`);

    if (count > 0) {
      console.log('🎉 Database seeding completed successfully!');
      
      // Show sample questions
      const samples = await Question.find().limit(3);
      console.log('📋 Sample questions:', samples.map(q => ({ id: q._id, question: q.question })));
    } else {
      console.log('❌ Warning: No questions found after seeding');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding questions:', error);
    process.exit(1);
  }
}

seedQuestions();
