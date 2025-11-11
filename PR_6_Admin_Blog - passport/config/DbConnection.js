const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect("mongodb+srv://pallavis:231003@cluster0.uetqdm3.mongodb.net/project-6");
    // await mongoose.connect("");
    console.log("Database Connected Successfully");
  } catch (err) {
    console.error("Database Connection Failed:", err);
  }
};

module.exports = dbConnect;
