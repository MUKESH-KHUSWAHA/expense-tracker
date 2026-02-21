import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGO_URL;
    if (!uri) throw new Error("MONGO_URI or MONGO_URL is required");
    await mongoose.connect(uri);
  } catch (error) {
    process.exit(1);
  }
};

export default connectDb;