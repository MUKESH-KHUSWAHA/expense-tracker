import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDb from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server error:", error);
  }
};

startServer();