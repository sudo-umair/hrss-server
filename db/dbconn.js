import mongoose from "mongoose";
// const MONGO_URI = "mongodb://localhost:27017/hrss";

const MONGO_URI =
  "mongodb+srv://talha:talha1234@hrss.u1ubyta.mongodb.net/?retryWrites=true&w=majority";

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
