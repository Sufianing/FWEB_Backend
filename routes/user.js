import express from "express";
import User from "../models/user.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/", async (req, res) => {
  try {
    const { name, email, password, user_type, student_id } = req.body;

    if (!name || !email || !password || !user_type) {
      return res.status(400).json({ message: "Name, email, password and role are required" });
    }

    if (user_type === "Student" && !student_id) {
      return res.status(400).json({ message: "Student ID is required for students" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User({
      name,
      email,
      password, 
      user_type,
      student_id: user_type === "Student" ? student_id : null,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
