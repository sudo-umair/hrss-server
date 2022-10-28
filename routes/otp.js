import otpGenerator from 'otp-generator';
import Otp from '../models/Otp.js';
import User from '../models/User.js';
import Hospital from '../models/Hospital.js';
import { sendEmailToUser } from './nodeMailer.js';
import { Router } from 'express';
import { sendNotificationToUser } from './appNotifications.js';

const otpRouter = Router();

otpRouter.post('/forgotPassword', (req, res) => {
  const { email } = req.body;
  console.log(req.body);

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        Otp.findOne({ email }).then((otp) => {
          if (otp) {
            res.send({
              status: '400',
              message:
                'OTP sent already. Please check your email for the OTP or try again after 2 minutes',
            });
          } else {
            const otp = otpGenerator.generate(6, {
              digits: true,
              upperCaseAlphabets: false,
              lowerCaseAlphabets: false,
              specialChars: false,
            });

            const newOtp = new Otp({
              email,
              otp,
            });

            newOtp
              .save()
              .then((response) => {
                sendEmailToUser(
                  email,
                  'OTP',
                  `Your OTP is: ${response.otp} for ${response.email}`
                );
                res.send({
                  status: '200',
                  message: 'Otp sent successfully on ' + email,
                });
                setTimeout(() => {
                  Otp.findOneAndDelete({ email }).then((otp) => {
                    if (otp) {
                      console.log('OTP Deleted from DB');
                    }
                  });
                }, 120000);
              })
              .catch((err) => {
                console.log(err);
                res.send({
                  status: '500',
                  message: 'Error Sending OTP. Please try again later',
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({
        status: '500',
        message: 'Error Sending OTP. Please try again later',
      });
    });
});

otpRouter.post('/verifyOtp', (req, res) => {
  const { email, otp } = req.body;

  Otp.findOne({ email })
    .then((otpData) => {
      if (otpData) {
        if (otpData.otp === otp) {
          res.send({
            status: '200',
            message: 'OTP Verified',
          });
        } else {
          res.send({
            status: '400',
            message: 'Invalid OTP',
          });
        }
      } else {
        res.send({
          status: '400',
          message: 'OTP Not Found',
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({
        status: '500',
        message: 'Error Verifying OTP',
      });
    });
});

otpRouter.post('/resetPassword', (req, res) => {
  const { email, password, userType } = req.body;
  if (userType === 'user') {
    User.findOne({ email })
      .then((user) => {
        if (user) {
          user.hashPassword(password).then(() => {
            res.send({
              status: '200',
              message: 'Password Reset Successfully',
            });
          });
          sendNotificationToUser(
            email,
            'Password Reset',
            `Password for ${email} has been reset successfully`,
            {}
          );
          Otp.findOneAndDelete({ email }).then((otp) => {
            if (otp) {
              console.log('OTP Deleted from DB');
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.send({
          status: '500',
          message: 'Error Resetting Password',
        });
      });
  } else if (userType === 'hospital') {
    Hospital.findOne({ email })
      .then((hospital) => {
        if (hospital) {
          hospital.password = password;
          hospital
            .save()
            .then((hospital) => {
              res.send({
                status: '200',
                message: 'Password Reset Successful',
              });
            })
            .catch((err) => {
              console.log(err);
              res.send({
                status: '500',
                message: 'Error Resetting Password',
              });
            });
        } else {
          res.send({
            status: '400',
            message: 'Account Does Not Exist',
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.send({
          status: '500',
          message: 'Error Resetting Password',
        });
      });
  }
});

export default otpRouter;
