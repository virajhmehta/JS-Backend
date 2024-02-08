import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";




const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDb Connected!! DB HOST: ${connectionInstance.connection.host}`); // this written for testing which db we are using testing devloper
    } catch (error) {
        console.error("MongoDb connection error: ", error);
        process.exit(1) // rather than thr error
    }
}
export default connectDB