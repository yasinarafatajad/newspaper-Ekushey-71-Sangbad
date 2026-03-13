import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongodDB connected at ${conn.connection.name}`);
  } catch (err: any) {
    console.log(err.message);
  }
};
export default connectDB;
