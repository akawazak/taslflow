require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  });
