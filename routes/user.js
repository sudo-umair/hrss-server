import { Router } from "express";
import User from "../models/User.js";

const userRouter = Router();

userRouter.post("/signup", (req, res) => {
  const { fName, lName, email, password, phone, cnic } = req.body;
  console.log(req.body);

  User.findOne({ email })
    .then((user) => {
      if (user) {
        res.send({ status: "400", message: "Account Already Exists" });
      } else {
        const newUser = new User({
          name: fName + " " + lName,
          email,
          password,
          phone,
          cnic,
        });

        newUser
          .save()
          .then((user) => {
            res.send({
              status: "201",
              message: "SignUp Successful",
            });
            console.log(user);
          })
          .catch((err) => {
            res.send({ status: "500", message: "Signup Failed" });
            console.log(err);
          });
      }
    })
    .catch((err) => {
      res.send({ status: "500", message: "Error SigningUp" });
      console.log(err);
    });
});

userRouter.post("/signin", (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.send({ status: "400", message: "Account Does Not Exist" });
      } else {
        user
          .isValidPassword(password)
          .then((isMatch) => {
            if (isMatch) {
              res.send({
                status: "200",
                message: "Login Successful",
                user: user,
              });
            } else {
              res.send({ status: "400", message: "Invalid Password" });
            }
          })
          .catch((err) => {
            res.send({ status: "500", message: "Error Logging In" });
          });
      }
    })
    .catch((err) => {
      res.send({ status: "500", message: "Error Logging In" });
    });
});

userRouter.put("/updateAccount", (req, res) => {
  const { name, email, oldPassword, password, phone } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.send({ status: "400", message: "Account Does Not Exist" });
      } else {
        user.isValidPassword(oldPassword).then((isMatch) => {
          if (isMatch) {
            user.name = name;
            user.password = password;
            user.phone = phone;
            user.updatedAt = Date.now();
            user
              .save()
              .then((user) => {
                res.send({
                  status: "200",
                  message: "Account Updated",
                  user: user,
                });
              })
              .catch((err) => {
                res.send({ status: "500", message: "Updating Account Failed" });
              });
          } else {
            res.send({ status: "400", message: "Invalid Password" });
          }
        });
      }
    })
    .catch((err) => {
      res.send({ status: "500", message: "Error Updating Account" });
    });
});

userRouter.post("/deleteAccount", (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.send({ status: "400", message: "Account Does Not Exist" });
      } else {
        user.isValidPassword(password).then((isMatch) => {
          if (isMatch) {
            user
              .remove()
              .then((user) => {
                res.send({
                  status: "200",
                  message: "Account Deleted",
                  user: user,
                });
              })
              .catch((err) => {
                res.send({ status: "500", message: "Deleting Account Failed" });
              });
          } else {
            res.send({ status: "400", message: "Invalid Password" });
          }
        });
      }
    })
    .catch((err) => {
      res.send({ status: "500", message: "Deleting Account Failed" });
    });
});

export default userRouter;
