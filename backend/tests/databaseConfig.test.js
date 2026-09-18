const connectDB = require('../config/database');

describe('MongoDB URI resolver', () => {
  const originalMONGO_URI = process.env.MONGO_URI;
  const originalMONGODB_URI = process.env.MONGODB_URI;

  afterEach(() => {
    process.env.MONGO_URI = originalMONGO_URI;
    process.env.MONGODB_URI = originalMONGODB_URI;
  });

  test('prefers MONGO_URI when present', () => {
    process.env.MONGO_URI = 'mongodb+srv://jay:team2005@cluster0.c7tt2.mongodb.net/?retryWrites=true&w=majority';
    delete process.env.MONGODB_URI;

    expect(connectDB.resolveMongoUri()).toBe(process.env.MONGO_URI);
  });

  test('falls back to MONGODB_URI when MONGO_URI is missing', () => {
    delete process.env.MONGO_URI;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/arambh';

    expect(connectDB.resolveMongoUri()).toBe(process.env.MONGODB_URI);
  });
});
