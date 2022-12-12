import Volunteer from '../models/Volunteer.js';
import express from 'express';
import {
  sendNotificationToUser,
  sendNotificationToGroup,
} from './appNotifications.js';

const volunteerRouter = express.Router();

volunteerRouter.post('/createVolunteerRequest', async (req, res) => {
  try {
    const {
      hospitalName,
      hospitalEmail,
      hospitalPhone,
      hospitalLocation,
      volunteerRequestTitle,
      volunteerRequestDescription,
      volunteersRequired,
      timeDuration,
    } = req.body;

    const volunteer = new Volunteer({
      hospitalName,
      hospitalEmail,
      hospitalPhone,
      hospitalLocation,
      volunteerRequestTitle,
      volunteerRequestDescription,
      volunteersRequired,
      timeDuration,
    });

    await volunteer.save();

    res.send({ status: '200', message: 'Volunteer Request Added' });
  } catch (err) {
    console.log(err);
    res.send({ status: '500', message: 'Error Adding Volunteer Request' });
  }
});

volunteerRouter.post('/fetchMyVolunteerRequests', async (req, res) => {
  try {
    const { hospitalEmail } = req.body;
    const volunteerRequests = await Volunteer.find({
      hospitalEmail,
    });
    res.send({
      status: '200',
      message: 'Volunteer Requests Fetched Successfully',
      results: volunteerRequests,
    });
  } catch (err) {
    res.send({ status: '500', message: 'Error Fetching Volunteer Requests' });
  }
});

volunteerRouter.post('/deleteVolunteerRequest', async (req, res) => {
  try {
    const { volunteerRequestId } = req.body;
    await Volunteer.findByIdAndDelete(volunteerRequestId);
    res.send({ status: '200', message: 'Volunteer Request Deleted' });
  } catch (err) {
    console.log(err);
    res.send({ status: '500', message: 'Error Deleting Volunteer Request' });
  }
});

volunteerRouter.post('/updateApplicantStatus', async (req, res) => {
  const {
    volunteerRequestId,
    applicantId,
    applicantEmail,
    hospitalName,
    requestStatus,
  } = req.body;
  try {
    const volunteer = await Volunteer.findById(volunteerRequestId);
    const applicant = volunteer.applicants.find(
      (applicant) => applicant._id == applicantId
    );
    applicant.applicantRequestStatus = requestStatus;
    await volunteer.save();
    res.send({
      status: '200',
      message: `${applicant.applicantName} is ${requestStatus}`,
    });
    sendNotificationToUser(
      applicantEmail,
      'Applicant Status Updated',
      `Your request has been ${requestStatus} by ${hospitalName}`,
      '{"screen":"Volunteers"}'
    );
  } catch (err) {
    console.log(err);
    res.send({
      status: '500',
      message: `Error ${requestStatus.slice(0, -2)}ing Applicant`,
    });
  }
});

volunteerRouter.post('/updateVolunteerRequest', async (req, res) => {
  const { volunteerRequestId, requestStatus } = req.body;
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(volunteerRequestId, {
      requestStatus,
    });
    await volunteer.save();
    res.send({
      status: '200',
      message: `Volunteer Request is ${requestStatus}`,
    });
    const emails = volunteer.applicants.map((applicant) => {
      return applicant.applicantEmail;
    });
    sendNotificationToGroup(
      emails,
      `Volunteer Request ${requestStatus}`,
      `${volunteer.hospitalName} has ${requestStatus} requests for ${volunteer.volunteerRequestTitle}`,
      '{"screen":"Volunteers"}'
    );
  } catch (err) {
    console.log(err);
    res.send({
      status: '500',
      message: `Error ${requestStatus.slice(0, -2)}ing Volunteer Request`,
    });
  }
});

//app
volunteerRouter.get('/fetchAllRequests', async (req, res) => {
  try {
    const volunteerRequests = await Volunteer.find({});
    res.send({
      status: '200',
      message: 'Volunteer Requests Fetched',
      results: volunteerRequests,
    });
  } catch (err) {
    res.send({ status: '500', message: 'Error Fetching Volunteer Requests' });
  }
});

volunteerRouter.post('/applyForVolunteerRequest', async (req, res) => {
  try {
    const {
      volunteerRequestId,
      applicantEmail,
      applicantName,
      applicantCnic,
      applicantPhone,
    } = req.body;
    req.body;

    const volunteer = await Volunteer.findOne({
      _id: volunteerRequestId,
    });
    volunteer.applicants.push({
      applicantEmail,
      applicantName,
      applicantCnic,
      applicantPhone,
    });
    await volunteer.save();

    res.send({ status: '200', message: ' Applied for Volunteer Request' });
  } catch (err) {
    console.log(err);
    res.send({
      status: '500',
      message: 'Error Applying for Volunteer Request',
    });
  }
});

volunteerRouter.post('/withdrawVolunteerRequest', async (req, res) => {
  try {
    const { id, applicantEmail } = req.body;
    const volunteerRequest = await Volunteer.findOne({
      _id: id,
    });

    const applicant = volunteerRequest.applicants.find(
      (applicant) => applicant.applicantEmail === applicantEmail
    );

    if (applicant.applicantRequestStatus === 'Approved') {
      res.send({
        status: '500',
        message: 'You cannot withdraw your request as it has been approved',
      });
    } else {
      volunteerRequest.applicants.pull(applicant);
      await volunteerRequest.save();
      res.send({ status: '200', message: 'Volunteer Request Withdrawn' });
    }
  } catch (err) {
    res.send({ status: '500', message: 'Error Withdrawing Volunteer Request' });
  }
});

volunteerRouter.post('/hideVolunteerRequest', (req, res) => {
  const { id, applicantEmail } = req.body;

  Volunteer.findOne({ _id: id })
    .then((volunteerRequest) => {
      volunteerRequest.ignoredBy.push(applicantEmail);
      volunteerRequest
        .save()
        .then((result) => {
          res.send({
            status: '200',
            message: 'Request Hidden',
          });
        })
        .catch((err) => {
          res.send({
            status: '500',
            message: 'Hiding Request Failed',
            error: err,
          });
        });
    })
    .catch((err) => {
      res.send({
        status: '500',
        message: 'Hiding Request Failed',
        error: err,
      });
    });
});

export default volunteerRouter;
