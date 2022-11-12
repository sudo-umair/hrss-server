import { Router } from 'express';
import Hospital from '../models/Hospital.js';
import Resource from '../models/Resource.js';
import Volunteer from '../models/Volunteer.js';

const hospitalRouter = Router();

hospitalRouter.post('/signup', (req, res) => {
  const { name, email, password, contact, address } = req.body;
  console.log(req.body);

  Hospital.findOne({ email })
    .then(async (hospital) => {
      if (hospital) {
        res.send({ status: '400', message: 'Account Already Exists' });
      } else {
        const newHospital = new Hospital({
          name,
          email,
          password,
          contact,
          address,
        });

        newHospital
          .hashPassword(password)
          .then(() => {
            res.send({
              status: '201',
              message: 'SignUp Successful',
            });
            console.log(newHospital);
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

hospitalRouter.post('/signin', (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  Hospital.findOne({ email })
    .then((hospital) => {
      if (!hospital) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        hospital
          .validatePassword(password)
          .then((isMatch) => {
            if (isMatch) {
              hospital
                .generateAuthToken()
                .then(() => {
                  console.log(hospital);
                  res.send({
                    status: '200',
                    message: 'SignIn Successful',
                    hospital: hospital,
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

hospitalRouter.put('/update-account', (req, res) => {
  const { name, email, token, contact, address } = req.body;
  Hospital.findOne({ email })
    .then((hospital) => {
      if (!hospital) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        hospital.validateToken(token).then((isMatch) => {
          if (isMatch) {
            hospital
              .updateAccount(name, contact, address)
              .then(() => {
                res.send({
                  status: '200',
                  message: 'Account Updated',
                  hospital,
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

hospitalRouter.put('/update-password', (req, res) => {
  const { email, token, password, newPassword } = req.body;
  Hospital.findOne({ email })
    .then((hospital) => {
      if (!hospital) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        hospital.validateToken(token).then((isMatch) => {
          if (isMatch) {
            hospital
              .validatePassword(password)
              .then((isMatch) => {
                if (isMatch) {
                  hospital
                    .hashPassword(newPassword)
                    .then(() => {
                      res.send({
                        status: '200',
                        message: 'Password Updated',
                        hospital,
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

hospitalRouter.post('/delete-account', (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  Hospital.findOne({ email })
    .then((hospital) => {
      if (!hospital) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        hospital.isValidPassword(password).then((isMatch) => {
          if (isMatch) {
            hospital
              .remove()
              .then((hospital) => {
                res.send({
                  status: '200',
                  message: 'Account Deleted',
                  hospital,
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

hospitalRouter.post('/signout', (req, res) => {
  const { email, token } = req.body;
  console.log(req.body);

  Hospital.findOne({ email })
    .then((hospital) => {
      if (!hospital) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        hospital.validateToken(token).then((isMatch) => {
          if (isMatch) {
            hospital
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

hospitalRouter.post('/resume-session', (req, res) => {
  const { email, token } = req.body;
  console.log(req.body);

  Hospital.findOne({ email })
    .then((hospital) => {
      if (!hospital) {
        res.send({ status: '400', message: 'Account Does Not Exist' });
      } else {
        hospital
          .validateToken(token)
          .then((isMatch) => {
            if (isMatch) {
              res.send({
                status: '200',
                message: 'Resume Session Successful',
                hospital,
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

hospitalRouter.post('/requests-count', async (req, res) => {
  try {
    const { email } = req.body;
    console.log(req.body);
    var hospitalRecord = {
      resources: {
        requestsMadeByHospitalTotal: 0,
        requestsMadeByHospitalApproved: 0,
        requestsMadeByHospitalPending: 0,
        requestsApprovedByHospital: 0,
      },
      volunteers: {
        requestsMadeByHospitalTotal: 0,
        approvedVolunteers: 0,
        pendingVolunteers: 0,
        totalVolunteers: 0,
      },
    };
    await Hospital.findOne({ email })
      .then(async (hospital) => {
        if (!hospital) {
          res.send({ status: '400', message: 'Account Does Not Exist' });
        } else {
          try {
            await Resource.find({ requestedByEmail: email })
              .then((resources) => {
                hospitalRecord.resources.requestsMadeByHospitalTotal =
                  resources.length;
                resources.forEach((resource) => {
                  if (resource.requestStatus === 'Approved') {
                    hospitalRecord.resources.requestsMadeByHospitalApproved++;
                  } else if (resource.requestStatus === 'Pending') {
                    hospitalRecord.resources.requestsMadeByHospitalPending++;
                  }
                });
              })
              .catch((err) => {
                console.log(err);
              });

            await Resource.find({ approvedByEmail: email })
              .then((resources) => {
                hospitalRecord.resources.requestsApprovedByHospital =
                  resources.length;
              })
              .catch((err) => {
                console.log(err);
              });

            await Volunteer.find({ hospitalEmail: email })
              .then((volunteerRequests) => {
                hospitalRecord.volunteers.requestsMadeByHospitalTotal =
                  volunteerRequests.length;

                volunteerRequests.forEach((volunteerReq) => {
                  volunteerReq.applicants.forEach((applicant) => {
                    if (applicant.applicantRequestStatus === 'Approved') {
                      hospitalRecord.volunteers.approvedVolunteers++;
                    }
                    if (applicant.applicantRequestStatus === 'Applied') {
                      hospitalRecord.volunteers.pendingVolunteers++;
                    }

                    hospitalRecord.volunteers.totalVolunteers++;
                  });
                });
              })
              .catch((err) => {
                console.log(err);
              });
            res.send({
              status: '200',
              message: 'Requests Count Fetched',
              hospitalRecord,
            });
          } catch (err) {
            console.log(err);
            res.send({ status: '500', message: 'Error' });
          }
        }
      })
      .catch((err) => {
        console.log(err);
        res.send({ status: '500', message: 'Error' });
      });
  } catch (err) {
    console.log(err);
    res.send({ status: '500', message: 'Error' });
  }
});

export default hospitalRouter;
