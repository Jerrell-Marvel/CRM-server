// Setting up express
const express = require("express");
const { connect } = require("mongoose");
const connectDB = require("./db/connectDB");
const app = express();

//Express async errors
require("express-async-errors");

// errorHandler import
const errorHandler = require("./middleware/errorHandler");

//dotenv
require("dotenv").config();

//Cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//Authentication middleware
const authentication = require("./middleware/authentication");

//Routes import
const userRoutes = require("./routes/user");
const labelRoutes = require("./routes/label");
const customerRoutes = require("./routes/customer");

//Parse json
app.use(express.json());

app.use("/api/v1", userRoutes);
app.use("/api/v1/label", authentication, labelRoutes);
app.use("/api/v1/customer", authentication, customerRoutes);

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
