import Auth from "../models/Users.js"; // Aapka model file
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()

// REGISTER USER
export const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const existingUser = await Auth.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save User
        const newUser = new Auth({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// LOGIN USER
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await Auth.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ token, username: user.username });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};