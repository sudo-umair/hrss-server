import jwt from "jsonwebtoken";
import user from "../models/web/UserSchema.js";

async function Authenticate(req, res, next) {
  try {
    console.log("auth data");
    console.log("chal para", req.cookies.jwtoken);
    // console.logreq.cookie;
    // const token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmRkOWE2NzNiNmM4YTA3ZTNlNDhlODIiLCJpYXQiOjE2NjA1Njg5MzV9.s53T0jo70cLio-83rGf5JV2o6UKo111d20Efy-Sk-rI'
    const token = req.cookies.jwtoken;
    console.log(token);
    // console.log(req.cookies)
    console.log("hello auth");
    const verifyToken = jwt.verify(token, `${process.env.SECRET_TOKEN}`);
    console.log("AUthenticate", verifyToken);
    const rootuser = await user.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });
    console.log("rootuser", rootuser);

    if (rootuser) {
      // console.log('hello from auth')
      // // console.log(rootuser)
      // req.token = token;
      // req.rootuser= rootuser;
      // req.userId = rootuser._id;
      res.send(rootuser);
    } else {
      res.send("User Not Found");
    }
    next();
  } catch (error) {
    res.send(error);
  }
}

export default Authenticate;
