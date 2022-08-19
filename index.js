import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToMongo from "./db/dbconn.js"; //connect to mongoDB

//import web routes
import router from "./routes/web/Router.js";
import resource from "./routes/web/ResourceRoute.js";
import volunteer from "./routes/web/VolunteerRoute.js";

//import mobile routes
import userAuthRouter from "./routes/mobile/user.js";
import resourceRouter from "./routes/mobile/resource.js";
import donationRouter from "./routes/mobile/donations.js";

connectToMongo();

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());

//web routes
app.use(router);
app.use(resource);
app.use(volunteer);

//mobile routes
app.use("/user", userAuthRouter);
app.use("/resources", resourceRouter);
app.use("/donations", donationRouter);

const port = process.env.PORT || 4400;

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on ${port} `);
});

export default app;
