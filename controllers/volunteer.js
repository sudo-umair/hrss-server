import Volunteer from '../models/Volunteer.js';
import {
  sendNotificationToUser,
  sendNotificationToGroup,
} from '../utils/appNotifications.js';

export const createVolunteerRequest = async (req, res) => {
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
};

export const updateRequest = async (req, res) => {
  const {
    id,
    volunteerRequestTitle,
    volunteerRequestDescription,
    volunteersRequired,
    timeDuration,
  } = req.body;
  try {
    await Volunteer.findById(id)
      .then(async (result) => {
        if (result.applicants.length > 0) {
          res.send({
            status: '500',
            message:
              'Cannot Update, Applicants have already applied for this request',
          });
        } else {
          await Volunteer.findByIdAndUpdate(id, {
            volunteerRequestTitle,
            volunteerRequestDescription,
            volunteersRequired,
            timeDuration,
          });
          res.send({
            status: '200',
            message: 'Volunteer Request Updated',
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.send({
          status: '500',
          message: 'Failed to Update Volunteer Request',
          error: err,
        });
      });
  } catch (err) {
    console.log(err);
    res.send({
      status: '500',
      message: 'Failed to Update Volunteer Request',
      error: err,
    });
  }
};

export const fetchMyVolunteerRequests = async (req, res) => {
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
};

export const deleteVolunteerRequest = async (req, res) => {
  try {
    const { volunteerRequestId } = req.body;
    await Volunteer.findByIdAndDelete(volunteerRequestId);
    res.send({ status: '200', message: 'Volunteer Request Deleted' });
  } catch (err) {
    console.log(err);
    res.send({ status: '500', message: 'Error Deleting Volunteer Request' });
  }
};

export const updateApplicantStatus = async (req, res) => {
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
};

export const updateVolunteerRequest = async (req, res) => {
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
};

export const fetchAllRequests = async (req, res) => {
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
};

export const applyForVolunteerRequest = async (req, res) => {
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
};

export const withdrawVolunteerRequest = async (req, res) => {
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
};

export const hideVolunteerRequest = (req, res) => {
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
};
