import { Router } from 'express';
import User from '../models/User.js';

const userRouter = Router();

userRouter.post('/signup', async (req, res) => {
  const { fName, lName, email, password, phone, cnic } = req.body;
  console.log(req.body);

  await User.findOne({ email })
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

        await newUser
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

userRouter.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  await User.findOne({ email })
    .then(async (user) => {
      if (!user) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        await user
          .validatePassword(password)
          .then(async (isMatch) => {
            if (isMatch) {
              await user
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

userRouter.put('/update-account', async (req, res) => {
  const { name, email, token, phone } = req.body;
  await User.findOne({ email })
    .then(async (user) => {
      if (!user) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        await user.validateToken(token).then(async (isMatch) => {
          if (isMatch) {
            await user
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

userRouter.put('/update-password', async (req, res) => {
  const { email, token, password, newPassword } = req.body;
  await User.findOne({ email })
    .then(async (user) => {
      if (!user) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        await user.validateToken(token).then(async (isMatch) => {
          if (isMatch) {
            await user
              .validatePassword(password)
              .then(async (isMatch) => {
                if (isMatch) {
                  await user
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

userRouter.post('/delete-account', async (req, res) => {
  const { email, token } = req.body;
  console.log(req.body);

  await User.findOne({ email })
    .then(async (user) => {
      if (!user) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        await user.validateToken(token).then(async (isValid) => {
          if (isValid) {
            await User.findByIdAndDelete(user._id)
              .then(() => {
                res.send({ status: '200', message: 'Account Deleted' });
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

userRouter.post('/signout', async (req, res) => {
  const { email, token } = req.body;
  console.log(req.body);

  await User.findOne({ email })
    .then(async (user) => {
      if (!user) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        await user.validateToken(token).then(async (isMatch) => {
          if (isMatch) {
            await user
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

userRouter.post('/resume-session', async (req, res) => {
  const { email, token } = req.body;
  console.log(req.body);

  await User.findOne({ email })
    .then(async (user) => {
      if (!user) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        await user
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
