const express = require('express');
const jwt = require('jsonwebtoken');
const admin = require('../firebaseAdmin');
const User = require('../models/User');
const router = express.Router();

router.post('/google', async (req, res) => {
  const { idToken } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email } = decodedToken;

    let user = await User.findOne({ email: email });
    if (!user) {
      user = new User({ email: email });
      await user.save({ validateBeforeSave: false });
    }

    const payload = { userId: user._id };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token: jwtToken });

  } catch (error) {
    // --- THIS IS THE UPDATED PART ---
    console.error("--- Full Firebase Authentication Error ---");
    console.error("Error Code:", error.code);
    console.error("Error Message:", error.message);
    console.error("--- End of Error ---");

    // Specifically check for clock skew issues
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ 
        msg: 'Token expired. This is often caused by your computer clock being out of sync.' 
      });
    }

    return res.status(401).send('Authentication failed.');
  }
});

module.exports = router;