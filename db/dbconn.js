import mongoose from "mongoose";
// const MONGO_URI = "mongodb://localhost:27017/hrss";

const MONGO_URI =
  "mongodb+srv://talhamalik:talha1234@fyp.9rvjl.mongodb.net/HRSS?retryWrites=true&w=majority";

const connectToMongo = () => {
  try {
    mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err);
  }
};

export default connectToMongo;
