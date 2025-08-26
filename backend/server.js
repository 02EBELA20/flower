// server.js

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const crypto = require('crypto');
// MongoDB Atlas server API ვერსიის იმპორტი
const { ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// User Schema
// დამატებითი ველები resetPasswordToken და resetPasswordExpires საჭიროა პაროლის აღდგენის მექანიზმისთვის
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
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

// Password Reset Request Endpoint
// მომხმარებელი აწვდის ელფოსტას; თუ არსებობს, ვქმნით ტოკენს და ვაბრუნებთ reset ბმულს.
app.post('/api/request-password-reset', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        // enumeration attack-ის თავიდან ასაცილებლად ვაბრუნებთ OK ინფორმაციას, თუნდაც მომხმარებელი არ იარსებებდეს
        if (!user) {
            return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
        }
        // შემთხვევითი ტოკენის გენერირება და ვადის მითითება
        const token = crypto.randomBytes(20).toString('hex');
        const expires = Date.now() + 3600000; // 1 საათი მოქმედება
        user.resetPasswordToken = token;
        user.resetPasswordExpires = expires;
        await user.save();
        // რეალურ პროექტში ეს ბმული ელფოსტით იგზავნება
        const resetLink = `http://localhost:5000/reset-password.html?token=${token}`;
        console.log(`Password reset link for ${email}: ${resetLink}`);
        return res.status(200).json({ message: 'Reset link generated successfully.', resetLink });
    } catch (error) {
        console.error('Password reset request error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Password Reset Endpoint
// ტოკენისა და ახალი პაროლის მიღებისას შევამოწმებთ ვადას და შევუცვლით პაროლს
app.post('/api/reset-password', async (req, res) => {
    const { token, password } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Password reset error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Start Server – აქამდე იყენებდა mongoose.connect().then().catch().
// ახლა ვიყენებთ ასინქრონულ ფუნქციას, რათა კავშირი დამყარდეს წინასწარ
const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            // MongoDB Atlas-ის server API პარამეტრები
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
            // Atlas-ს ჯობია მეტი ლოდინის დრო მისცეთ
            serverSelectionTimeoutMS: 20000,
        });
        console.log('MongoDB დაკავშირებულია');
        app.listen(PORT, () => console.log(`სერვერი მუშაობს პორტზე ${PORT}`));
    } catch (err) {
        console.error('MongoDB დაკავშირების შეცდომა:', err);
        process.exit(1);
    }
})();
