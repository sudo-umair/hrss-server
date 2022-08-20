// const dotenv = require('dotenv').config();
// import dotenv from 'dotenv'
// import {} from 'dotenv/config'
import dotenv from "dotenv";
dotenv.config();
import expresss from "express";
import Hospital from "../models/Hospital.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Authenticate from "../middleware/Authenticate.js";

const hospitalRouter = expresss.Router();

hospitalRouter.post("/Signup", async (req, res) => {
  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const con_password = req.body.con_password;
  const contact = req.body.contact;
  const address = req.body.address;

  const preHospital = await Hospital.findOne(
    { username: username } && { email: email }
  );

  if (!preHospital) {
    const addHospital = new Hospital({
      name: name,
      username: username,
      email: email,
      password: password,
      con_password: con_password,
      contact: contact,
      address: address,
    });
    await addHospital.save();
    res.send({ Message: "Signup Successful" });
  } else {
    res.send({ Message: "Username already Exist" });
  }
});

hospitalRouter.post("/", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const existing_user = await Hospital.findOne({ username: username });

  try {
    if (existing_user) {
      //comparing password and password that user has typed
      const isMatch = await bcrypt.compare(password, existing_user.password);

      const token = await existing_user.generateToken();
      console.log("Hello from login router", token);
      res.cookie("jwtoken", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 500000000),
      });
      if (isMatch) {
        // console.log(existing_user);
        // res.send(200, { message: "Login Successfull", user: existing_user });
        res.send({
          status: 200,
          message: "Login Successfull",
          user: existing_user,
        });
      } else {
        res.send({ status: 400, error: "Password didn't match" });
        // res.send({ status: 400, error: "Password didn't match" })
      }
    } else {
      res.send({ status: 403, error: "Account didnt exist" });
    }
  } catch (error) {
    res.send(error);
  }
});

hospitalRouter.get("/Dashboard", Authenticate, async (req, res, next) => {
  // hospitalRouter.use(cookieParser)
  // Authenticate();
  try {
    console.log("hello");
    res.send();
  } catch (error) {
    res.send(error);
  }
});

export default hospitalRouter;
