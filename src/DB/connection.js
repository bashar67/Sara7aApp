import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("mongodb connected");
  } catch (error) {
    console.log("mongodb failed  connected", error);
  }
};

export default connectDB;
