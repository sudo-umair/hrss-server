import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToMongo from "./db/dbconn.js"; //connect to mongoDB

//import routes
import userRouter from "./routes/user.js";
import hospitalRouter from "./routes/hospital.js";
import donationRouter from "./routes/donations.js";
import resourceRouter from "./routes/resource.js";
import volunteerRouter from "./routes/volunteer.js";
import appNotificationsRouter from "./routes/appNotifications.js";
import otpRouter from "./routes/otp.js";

connectToMongo();

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/hospitals", hospitalRouter);
app.use("/volunteers", volunteerRouter);
app.use("/users", userRouter);
app.use("/resources", resourceRouter);
app.use("/donations", donationRouter);
app.use("/otp", otpRouter);
app.use("/notifications", appNotificationsRouter);

const port = process.env.PORT || 4400;

app.get("/", (req, res) => {
  res.send("Server is running on port " + port);
});

app.listen(port, () => {
  console.log(`Server is running on ${port} `);
});

export default app;
