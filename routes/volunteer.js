import Volunteer from "../models/Volunteer.js";
import express from "express";
import { sendNotificationToUser } from "./appNotifications.js";

const volunteerRouter = express.Router();

volunteerRouter.post("/createVolunteerRequest", async (req, res) => {
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

    res.send({ status: "200", message: "Volunteer Request Added" });
  } catch (err) {
    console.log(err);
    res.send({ status: "500", message: "Error Adding Volunteer Request" });
  }
});

volunteerRouter.post(
  "/fetchAllVolunteerRequestsForOneHospital",
  async (req, res) => {
    try {
      const { hospitalEmail } = req.body;
      const volunteerRequests = await Volunteer.find({
        hospitalEmail,
      });
      res.send({
        status: "200",
        message: "Volunteer Requests Fetched Successfully",
        results: volunteerRequests,
      });
    } catch (err) {
      res.send({ status: "500", message: "Error Fetching Volunteer Requests" });
    }
  }
);

volunteerRouter.put("/updateVolunteerRequest", async (req, res) => {
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

    const volunteer = await Volunteer.findOneAndUpdate(
      {
        hospitalEmail,
      },
      {
        hospitalName,
        hospitalEmail,
        hospitalPhone,
        hospitalLocation,
        volunteerRequestTitle,
        volunteerRequestDescription,
        volunteersRequired,
        timeDuration,
      }
    );
    res.send({ status: "200", message: "Volunteer Request Updated" });
  } catch (err) {
    console.log(err);
    res.send({ status: "500", message: "Error Updating Volunteer Request" });
  }
});

volunteerRouter.delete("/deleteVolunteerRequest", async (req, res) => {
  try {
    const { volunteerRequestId } = req.body;
    await Volunteer.findByIdAndDelete({
      _id: volunteerRequestId,
    });
    res.send({ status: "200", message: "Volunteer Request Deleted" });
  } catch (err) {
    console.log(err);
    res.send({ status: "500", message: "Error Deleting Volunteer Request" });
  }
});

volunteerRouter.post("/updateApplicantStatus", async (req, res) => {
  try {
    const {
      volunteerRequestId,
      applicantId,
      applicantEmail,
      hospitalName,
      requestStatus,
    } = req.body;
    const volunteer = await Volunteer.findOneAndUpdate({
      _id: volunteerRequestId,
    });

    const applicant = volunteer.applicants.id(applicantId);
    applicant.applicantRequestStatus = requestStatus;
    await volunteer.save();

    sendNotificationToUser(
      applicantEmail,
      "Volunteer Request Status Updated",
      `Your request has been ${requestStatus} by ${hospitalName}`,
      ""
    );

    res.send({ status: "200", message: "Applicant Status Updated" });
  } catch (err) {
    res.send({ status: "500", message: "Error Approving Volunteer Request" });
  }
});

volunteerRouter.post("/disableOneVolunteerRequest", async (req, res) => {
  try {
    const { volunteerRequestId } = req.body;
    const volunteer = await Volunteer.findOneAndUpdate({
      _id: volunteerRequestId,
    });
    volunteer.requestStatus = "Disabled";
    await volunteer.save();
    res.send({ status: "200", message: "Volunteer Request Disabled" });
  } catch (err) {
    res.send({ status: "500", message: "Error Disabling Volunteer Request" });
  }
});

//app
volunteerRouter.get("/fetchAllRequests", async (req, res) => {
  try {
    const volunteerRequests = await Volunteer.find({});
    res.send({
      status: "200",
      message: "Volunteer Requests Fetched Successfully",
      results: volunteerRequests,
    });
  } catch (err) {
    res.send({ status: "500", message: "Error Fetching Volunteer Requests" });
  }
});

volunteerRouter.post("/applyForVolunteerRequest", async (req, res) => {
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

    res.send({ status: "200", message: "Volunteer Request Applied" });
  } catch (err) {
    console.log(err);
    res.send({ status: "500", message: "Error Applying Volunteer Request" });
  }
});

volunteerRouter.post("/fetchMyVolunteerRequests", async (req, res) => {
  try {
    const { applicantEmail } = req.body;
    const volunteerRequests = await Volunteer.find({
      "applicants.applicantEmail": applicantEmail,
    });
    res.send({
      status: "200",
      message: "Volunteer Requests Fetched Successfully",
      results: volunteerRequests,
    });
  } catch (err) {
    res.send({ status: "500", message: "Error Fetching Volunteer Requests" });
  }
});

// const myRequests = [];

// const volunteerRequests = await Volunteer.find({});
// volunteerRequests.forEach((volunteerRequest) => {
//   volunteerRequest.applicants.forEach((applicant) => {
//     if (applicant.applicantEmail === applicantEmail) {
//       myRequests.push(volunteerRequest);
//     }
//   }),
//     (err) => {
//       console.log(err);
//     };
// });

export default volunteerRouter;
