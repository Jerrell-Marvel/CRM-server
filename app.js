// Setting up express
const express = require("express");
const { connect } = require("mongoose");
const connectDB = require("./db/connectDB");
const app = express();

// errorHandler import
const errorHandler = require("./middleware/errorHandler");

//dotenv
require("dotenv").config();

//Routes
const userRoutes = require("./routes/user");

//Parse json
app.use(express.json());

app.use("/api/v1", userRoutes);

//Error handling middleware
app.use(errorHandler);

//PORT
const PORT = 5000;
app.listen(PORT, async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    console.log(err);
  }
});
