import mongoose from "mongoose";
import env from "../utils/validateEnv";

const connectToDb = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log(`Successfully connected to the database ✅`);
  } catch (error) {
    console.error(error);
  }
};

export default connectToDb;
