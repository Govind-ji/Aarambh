require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const InterviewQuestion = require('../models/InterviewQuestion');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/arambh', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await InterviewQuestion.deleteMany({});
    console.log('Cleared existing data');

    // Create demo users
    const users = await User.create([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
        status: 'active',
        jobTitle: 'Software Engineer',
        company: 'Tech Corp',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user',
        status: 'active',
        jobTitle: 'Product Manager',
        company: 'Startup Inc',
      },
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        status: 'active',
        jobTitle: 'Administrator',
      },
    ]);

    console.log(`Created ${users.length} users`);

    // Create sample interview questions
    const questions = await InterviewQuestion.create([
      {
        text: 'Tell me about a challenging project you worked on and how you solved it.',
        category: 'behavioral',
        difficulty: 'medium',
        topic: 'Problem Solving',
        expectedDuration: 180,
        keywords: ['challenge', 'solution', 'teamwork', 'outcome'],
        evaluationCriteria: [
          { name: 'Clarity', description: 'How clearly the answer is structured', weight: 0.3 },
          { name: 'Relevance', description: 'How relevant the example is to the role', weight: 0.3 },
          { name: 'Depth', description: 'How much detail and insight is provided', weight: 0.4 },
        ],
      },
      {
        text: 'What are the key data structures and when would you use each?',
        category: 'technical',
        difficulty: 'hard',
        topic: 'Data Structures',
        expectedDuration: 300,
        keywords: ['arrays', 'linked lists', 'trees', 'graphs', 'hash tables'],
        evaluationCriteria: [
          { name: 'Completeness', description: 'All major structures covered', weight: 0.4 },
          { name: 'Technical Accuracy', description: 'Correct explanation of use cases', weight: 0.4 },
          { name: 'Communication', description: 'Clear explanation', weight: 0.2 },
        ],
      },
      {
        text: 'Describe your approach to debugging a complex issue.',
        category: 'behavioral',
        difficulty: 'medium',
        topic: 'Problem Solving',
        expectedDuration: 180,
        keywords: ['debugging', 'systematic', 'tools', 'communication'],
        evaluationCriteria: [
          { name: 'Methodology', description: 'Structured approach to debugging', weight: 0.5 },
          { name: 'Technical Knowledge', description: 'Knowledge of debugging tools', weight: 0.3 },
          { name: 'Communication', description: 'Ability to explain the process', weight: 0.2 },
        ],
      },
      {
        text: 'Design a system to manage millions of social media posts with fast retrieval and search capabilities.',
        category: 'system-design',
        difficulty: 'hard',
        topic: 'System Design',
        expectedDuration: 600,
        keywords: ['scalability', 'database', 'caching', 'indexing', 'architecture'],
        evaluationCriteria: [
          { name: 'Architecture Design', description: 'Overall system architecture', weight: 0.35 },
          { name: 'Scalability', description: 'Can the system scale', weight: 0.35 },
          { name: 'Trade-offs', description: 'Discussion of trade-offs', weight: 0.3 },
        ],
      },
      {
        text: 'Tell me about a time you had to work with a difficult team member.',
        category: 'behavioral',
        difficulty: 'medium',
        topic: 'Teamwork',
        expectedDuration: 180,
        keywords: ['conflict', 'resolution', 'communication', 'empathy'],
        evaluationCriteria: [
          { name: 'Empathy', description: 'Understanding different perspectives', weight: 0.3 },
          { name: 'Resolution', description: 'How the issue was resolved', weight: 0.4 },
          { name: 'Self Awareness', description: 'Understanding own role', weight: 0.3 },
        ],
      },
      {
        text: 'What is the difference between SQL and NoSQL databases?',
        category: 'technical',
        difficulty: 'easy',
        topic: 'Databases',
        expectedDuration: 120,
        keywords: ['SQL', 'NoSQL', 'relational', 'schema', 'scalability'],
        evaluationCriteria: [
          { name: 'Accuracy', description: 'Correct technical knowledge', weight: 0.5 },
          { name: 'Examples', description: 'Concrete examples provided', weight: 0.3 },
          { name: 'Use Cases', description: 'When to use each type', weight: 0.2 },
        ],
      },
    ]);

    console.log(`Created ${questions.length} interview questions`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
