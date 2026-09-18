const mongoose = require('mongoose');

(async () => {
  const uri = 'mongodb://127.0.0.1:27017/arambh';
  const emails = ['john@example.com', 'jane@example.com', 'admin@example.com'];

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection.db;
    const users = await db.collection('users').find({
      email: { $in: emails },
    }).toArray();

    console.log('demo users found:', JSON.stringify(users, null, 2));
    await mongoose.disconnect();
  } catch (error) {
    console.error('demo user check failed:', error.message);
    process.exit(1);
  }
})();
