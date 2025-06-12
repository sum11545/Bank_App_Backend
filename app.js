const express = require("express");
const app = express();
require("dotenv").config();
require("./config/config");
const userRoutes = require("./routes/userRoutes");
const accountRoutes = require("./routes/accountRoutes");
const cors = require("cors");
const port = process.env.PORT;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);
app.use(express.json());
app.use("/", userRoutes);
app.use("/Bank", accountRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
