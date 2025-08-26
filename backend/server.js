// server.js

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
// !!! დავამატეთ mongodb-დან ServerApiVersion-ის იმპორტი !!!
const { ServerApiVersion } = require('mongodb'); 
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- შესწორებული MongoDB Connection (ServerApi-ის გამოყენებით) ---
mongoose.connect(process.env.MONGODB_URI, {
  // ეს არის ახალი, რეკომენდებული პარამეტრები, რომლებიც აგვარებს კავშირის პრობლემებს
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
}).then(() => console.log('MongoDB დაკავშირებულია'))
  .catch(err => console.log('MongoDB დაკავშირების შეცდომა:', err));

// User Schema
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Register Endpoint
app.post('/api/register', async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ fullName, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("რეგისტრაციის შეცდომა:", error); 
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, fullName: user.fullName, email: user.email });
    } catch (error) {
        console.error("ავტორიზაციის შეცდომა:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`სერვერი მუშაობს პორტზე ${PORT}`));
