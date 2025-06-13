const express = require("express");
const route = express.Router();
const userModel = require("../model/userModel");
const accountModel = require("../model/accountModel");

const jwt = require("jsonwebtoken");

require("dotenv").config();

const isLogin = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log(token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }
    const extractedToken = token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token;

    const decode = jwt.verify(extractedToken, process.env.SECRET_KEY);
    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

route.post("/deposit", isLogin, async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    console.log(typeof amount);

    const user = req.user.userId;
    console.log(user);

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid deposit amount" });
    }

    if (amount > 1000000) {
      return res.status(400).json({
        message: "Maximum  deposit you can do is 1,000,000",
      });
    }
    const prevAmount = await userModel.findOne({ _id: user });
    const newAmount = prevAmount.balance + amount;
    const updatedBalance = await userModel.findOneAndUpdate(
      { _id: user },
      {
        $set: { balance: newAmount },
      },
      { $new: true }
    );

    const transaction = new accountModel({
      user,
      type: "deposit",
      amount: amount,
    });
    await transaction.save();
    res.status(200).json({ message: "Deposit success", transaction });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

route.post("/withdraw", isLogin, async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    const user = req.user.userId;
    console.log(user);

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid withdraw amount" });
    }

    if (amount > 1000000) {
      return res.status(400).json({
        message: "Maximum  withdraw you can do is 1,000,000",
      });
    }

    const prevAmount = await userModel.findOne({ _id: user });
    if (amount > prevAmount.balance) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    const newAmount = prevAmount.balance - amount;

    const updatedBalance = await userModel.findOneAndUpdate(
      { _id: user },
      {
        $set: { balance: newAmount },
      },
      { $new: true }
    );

    const transaction = new accountModel({
      user,
      type: "withdraw",
      amount: amount,
    });
    await transaction.save();
    res.status(200).json({ message: "Withdraw success", transaction });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

route.get("/allTransaction", isLogin, async (req, res) => {
  try {
    const user = req.user.userId;
    const allTransaction = await accountModel.find({ user: user });
    return res.status(200).json({
      data: allTransaction,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

route.get("/userProfile", isLogin, async (req, res) => {
  try {
    const user = req.user.userId;
    const userProfile = await userModel.findOne({ _id: user });
    return res.status(200).json({ data: userProfile });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

route.get("/allUsers", isLogin, async (req, res) => {
  try {
    const allUser = await userModel.find();
    return res.status(200).json({ data: allUser });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

route.get("/userTransactions/:userId", isLogin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const userTransactions = await accountModel.find({ user: userId });
    return res.status(200).json({ data: userTransactions });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});
module.exports = route;
