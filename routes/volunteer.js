import express from 'express';
import {
  createVolunteerRequest,
  applyForVolunteerRequest,
  fetchAllRequests,
  deleteVolunteerRequest,
  fetchMyVolunteerRequests,
  hideVolunteerRequest,
  updateApplicantStatus,
  updateVolunteerRequest,
  withdrawVolunteerRequest,
  updateRequest,
} from '../controllers/volunteer.js';

const volunteerRouter = express.Router();

volunteerRouter.post('/createVolunteerRequest', createVolunteerRequest);
volunteerRouter.post('/fetchMyVolunteerRequests', fetchMyVolunteerRequests);
volunteerRouter.post('/updateRequest', updateRequest);
volunteerRouter.post('/deleteVolunteerRequest', deleteVolunteerRequest);
volunteerRouter.post('/updateApplicantStatus', updateApplicantStatus);
volunteerRouter.post('/updateVolunteerRequest', updateVolunteerRequest);
//app
volunteerRouter.get('/fetchAllRequests', fetchAllRequests);
volunteerRouter.post('/applyForVolunteerRequest', applyForVolunteerRequest);
volunteerRouter.post('/withdrawVolunteerRequest', withdrawVolunteerRequest);
volunteerRouter.post('/hideVolunteerRequest', hideVolunteerRequest);

export default volunteerRouter;
