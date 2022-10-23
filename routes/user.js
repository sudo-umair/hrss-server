import { Router } from 'express';
import User from '../models/User.js';

const userRouter = Router();

userRouter.post('/signup', (req, res) => {
  const { fName, lName, email, password, phone, cnic } = req.body;
  console.log(req.body);

  User.findOne({ email })
    .then(async (user) => {
      if (user) {
        res.send({ status: '400', message: 'Account Already Exists' });
      } else {
        const newUser = new User({
          name: fName + ' ' + lName,
          email,
          password,
          phone,
          cnic,
        });

        newUser
          .hashPassword(password)
          .then(() => {
            res.send({
              status: '201',
              message: 'SignUp Successful',
            });
            console.log(newUser);
          })
          .catch((err) => {
            res.send({ status: '500', message: 'Signup Failed' });
            console.log(err);
          });
      }
    })
    .catch((err) => {
      res.send({ status: '500', message: 'Error SigningUp' });
      console.log(err);
    });
});

userRouter.post('/signin', (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        user
          .validatePassword(password)
          .then((isMatch) => {
            if (isMatch) {
              user
                .generateAuthToken()
                .then(() => {
                  res.send({
                    status: '200',
                    message: 'SignIn Successful',
                    user: user,
                  });
                })
                .catch((err) => {
                  res.send({ status: '500', message: 'Error SigningIn' });
                  console.log(err);
                });
            } else {
              res.send({ status: '400', message: 'Invalid Password' });
            }
          })
          .catch((err) => {
            console.log(err);
            res.send({ status: '500', message: 'Error SigningIn' });
          });
      }
    })
    .catch((err) => {
      res.send({ status: '500', message: 'Error Signing In' });
    });
});

userRouter.put('/update-account', (req, res) => {
  const { name, email, token, phone } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        user.validateToken(token).then((isMatch) => {
          if (isMatch) {
            user
              .updateAccount(name, phone)
              .then(() => {
                res.send({
                  status: '200',
                  message: 'Account Updated',
                  user,
                });
              })
              .catch((err) => {
                console.log(err);
                res.send({ status: '500', message: 'Updating Account Failed' });
              });
          } else {
            res.send({ status: '400', message: 'Invalid Token' });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({ status: '500', message: 'Error Updating Account' });
    });
});

userRouter.put('/update-password', (req, res) => {
  const { email, token, password, newPassword } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        user.validateToken(token).then((isMatch) => {
          if (isMatch) {
            user
              .validatePassword(password)
              .then((isMatch) => {
                if (isMatch) {
                  user
                    .hashPassword(newPassword)
                    .then(() => {
                      res.send({
                        status: '200',
                        message: 'Password Updated',
                        user,
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      res.send({
                        status: '500',
                        message: 'Updating Password Failed',
                      });
                    });
                } else {
                  res.send({ status: '400', message: 'Invalid Password' });
                }
              })
              .catch((err) => {
                console.log(err);
                res.send({ status: '500', message: 'Error Updating Password' });
              });
          } else {
            res.send({ status: '400', message: 'Invalid Token' });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({ status: '500', message: 'Error Updating Password' });
    });
});

userRouter.post('/delete-account', (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        user.isValidPassword(password).then((isMatch) => {
          if (isMatch) {
            user
              .remove()
              .then((user) => {
                res.send({
                  status: '200',
                  message: 'Account Deleted',
                  user: user,
                });
              })
              .catch((err) => {
                res.send({ status: '500', message: 'Deleting Account Failed' });
              });
          } else {
            res.send({ status: '400', message: 'Invalid Password' });
          }
        });
      }
    })
    .catch((err) => {
      res.send({ status: '500', message: 'Deleting Account Failed' });
    });
});

userRouter.post('/signout', (req, res) => {
  const { email, token } = req.body;
  console.log(req.body);

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        user.validateToken(token).then((isMatch) => {
          if (isMatch) {
            user
              .removeToken()
              .then(() => {
                res.send({ status: '200', message: 'SignOut Successful' });
              })
              .catch((err) => {
                res.send({ status: '500', message: 'Error SigningOut' });
              });
          } else {
            res.send({ status: '400', message: 'Invalid Password' });
          }
        });
      }
    })
    .catch((err) => {
      res.send({ status: '500', message: 'Error SigningOut' });
    });
});

userRouter.post('/resume-session', (req, res) => {
  const { email, token } = req.body;
  console.log(req.body);

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        user
          .validateToken(token)
          .then((isMatch) => {
            if (isMatch) {
              res.send({
                status: '200',
                message: 'Resume Session Successful',
                user,
              });
            } else {
              res.send({ status: '400', message: 'Invalid Token' });
            }
          })
          .catch((err) => {
            console.log(err);
            res.send({ status: '500', message: 'Error Resuming Session' });
          });
      }
    })
    .catch((err) => {
      console.log(err);

      res.send({ status: '500', message: 'Error Resuming Session' });
    });
});

export default userRouter;
