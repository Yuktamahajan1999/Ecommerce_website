import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Signup 
export const signup = async (req, res) => {
  const { fullName, username, password, phone } = req.body;

  if (!fullName || !username || !password || !phone) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      phone,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: newUser._id, fullName, username, phone },
      token,
    });
  } catch (err) {
    console.error("❌ Signup error:", err); 
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { id: user._id, fullName: user.fullName, username: user.username, phone: user.phone },
      token,
    });
  } catch (err) {
    console.error("❌ Login error:", err); 
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
