const express = require("express");
const route = express.Router();
const userModel = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const vaildator = require("../config/vaildation");
require("dotenv").config();

route.get("/", (req, res) => {
  res.send("hello from Banking Application");
});

route.post("/register", vaildator.registerVaildator, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, accountType } = req.body;
    const exstingUser = await userModel.findOne({ email });
    if (exstingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const day = new Date().getDate();
    const randomVal = Math.floor((Math.random() + 1000) * 9000);
    const accountNumber = `${year}${month}${day}${randomVal}`;
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      accountNumber,
      accountType,
    });
    await newUser.save();
    return res.status(201).json({ msg: "User created successfully" });
  } catch (error) {
    res.json({
      message: "Internal Server Error ",
      error: error.message,
    });
  }
});

route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User Not Exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "2h",
    });
    res.json({ message: "User Login Successfull", token });
  } catch (error) {
    res.json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = route;
