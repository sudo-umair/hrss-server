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

userRouter.post("/login", (req, res) => {
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
      res.send({ status: "500", message: "Error LoggingIn" });
    });
});

userRouter.put("/update", (req, res) => {
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
            user
              .save()
              .then((user) => {
                res.send({
                  status: "200",
                  message: "Update Successful",
                  user: user,
                });
              })
              .catch((err) => {
                res.send({ status: "500", message: "Error Updating" });
              });
          } else {
            res.send({ status: "400", message: "Invalid Password" });
          }
        });
      }
    })
    .catch((err) => {
      res.send({ status: "500", message: "Error Updating" });
    });
});

userRouter.delete("/delete", (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  User.findOneAndDelete({ email })
    .then((user) => {
      if (!user) {
        res.send({ status: "400", message: "Account Does Not Exist" });
      } else {
        if (user.password === password) {
          res.send({ status: "200", message: "Delete Successful" });
        } else {
          res.send({ status: "400", message: "Invalid Password" });
        }
      }
    })
    .catch((err) => {
      res.send({ status: "500", message: "Error Deleting" });
    });
});

export default userRouter;
