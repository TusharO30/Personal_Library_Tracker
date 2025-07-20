const express = require('express');
const jwt = require('jsonwebtoken');
const admin = require('../firebaseAdmin'); // Our new Firebase Admin config
const User = require('../models/User');    // Our existing User model
const router = express.Router();

// This new route handles Google Sign-In
router.post('/google', async (req, res) => {
  const { idToken } = req.body;

  try {
    // 1. Verify the token from the client with Google's services
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email } = decodedToken;

    // 2. Find or create a user in OUR MongoDB database
    let user = await User.findOne({ email: email });
    if (!user) {
      user = new User({ email: email });
      // Since Google handles the password, we can save without one
      await user.save({ validateBeforeSave: false });
    }

    // 3. Create OUR OWN JWT token to send back to the client
    const payload = { userId: user._id };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token: jwtToken });

  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).send('Authentication failed.');
  }
});

module.exports = router;