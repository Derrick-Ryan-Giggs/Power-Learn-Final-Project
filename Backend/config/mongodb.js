import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log("Attempting to connect with URI:", uri); // Add logging
    console.log("MONGODB_URI:", process.env.MONGODB_URI);
    
    await mongoose.connect(uri, {
      dbName: "MediLink",
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Detailed Database connection error:", {
      message: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
};

export default connectDB;