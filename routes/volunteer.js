import Volunteer from "../models/Volunteer.js";
import express from "express";

const volunteerRouter = express.Router();

volunteerRouter.post("/registerHospital", async (req, res) => {
  try {
    const { hospitalName, hospitalEmail, hospitalPhone, hospitalLocation } =
      req.body;

    const existingHospital = await Volunteer.findOne({
      hospitalEmail,
    });
    if (existingHospital) {
      res.send({
        status: "500",
        message: "Hospital Already Exists",
      });
    } else {
      const addHospital = new Volunteer({
        hospitalName,
        hospitalEmail,
        hospitalPhone,
        hospitalLocation,
      });
      await addHospital.save();
      res.send({
        status: "200",

        message: "Hospital Added Successfully",
      });
    }
  } catch (err) {
    res.send({
      status: "500",
      message: "Error Adding Hospital",
    });
  }
});

volunteerRouter.post("/createVolunteerRequest", async (req, res) => {
  try {
    const {
      hospitalEmail,
      volunteersRequired,
      volunteerTasks,
      volunteersSkills,
      timeDuration,
      additionalNotes,
    } = req.body;

    const addVolunteerRequest = await Volunteer.findOne({
      hospitalEmail,
    });

    console.log(addVolunteerRequest);
    addVolunteerRequest.volunteerRequests.push({
      volunteersRequired,
      volunteerTasks,
      volunteersSkills,
      timeDuration,
      additionalNotes,
    });

    await addVolunteerRequest.save();
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
      const volunteerRequests = await Volunteer.findOne({
        hospitalEmail,
      });
      res.send({
        status: "200",
        message: "Volunteer Requests Fetched Successfully",
        results: volunteerRequests.volunteerRequests,
      });
    } catch (err) {
      res.send({ status: "500", message: "Error Fetching Volunteer Requests" });
    }
  }
);

// volunteerRouter.post("/fetchOneVolunteerRequest", async (req, res) => {
//   try {
//     const { hospitalEmail, volunteerRequestId } = req.body;
//     const hospital = await Volunteer.findOne({
//       hospitalEmail,
//     });
//     const volunteerRequest = hospital.volunteerRequests.find(
//       (request) => request._id == volunteerRequestId
//     );
//     res.send({
//       status: "200",
//       message: "Volunteer Request Fetched Successfully",
//       results: volunteerRequest,
//     });

//     console.log(volunteerRequest);
//   } catch (err) {
//     res.send({ status: "500", message: "Error Fetching Volunteer Request" });
//   }
// });

//app
volunteerRouter.post("/fetchAllHospitalsRegistered", async (req, res) => {
  try {
    const hospitalsRegistered = await Volunteer.find();
    res.send({
      status: "200",
      message: "Volunteer Requests Fetched Successfully",
      results: hospitalsRegistered,
    });
  } catch (err) {
    res.send({ status: "500", message: "Error Fetching Volunteer Requests" });
  }
});

//web optional
volunteerRouter.post("/deleteVolunteerRequest", async (req, res) => {
  try {
    const { hospitalEmail, volunteerRequestId } = req.body;
    const hospital = await Volunteer.findOne({
      hospitalEmail,
    });
    const volunteerRequest = hospital.volunteerRequests.find(
      (request) => request._id == volunteerRequestId
    );
    hospital.volunteerRequests.pull(volunteerRequest);
    await hospital.save();
    res.send({
      status: "200",
      message: "Volunteer Request Deleted Successfully",
    });
  } catch (err) {
    res.send({ status: "500", message: "Error Deleting Volunteer Request" });
  }
});

//app
volunteerRouter.post("/applyVolunteerRequest", async (req, res) => {
  try {
    const { hospitalEmail, volunteerRequestId, name, email, phone, cnic } =
      req.body;

    const hospital = await Volunteer.findOne({
      hospitalEmail,
    });
    const volunteerRequest = hospital.volunteerRequests.find(
      (request) => request._id == volunteerRequestId
    );

    volunteerRequest.volunteers.push({
      applicantName: name,
      applicantEmail: email,
      applicantPhone: phone,
      applicantCnic: cnic,
    });
    await hospital.save();

    res.send({
      status: "200",
      message: "Volunteer Request Applied Successfully",
    });
  } catch (err) {
    res.send({ status: "500", message: "Error Applying Volunteer Request" });
  }
});

//web
volunteerRouter.post("/updateVolunteerRequestStatus", async (req, res) => {
  try {
    const { hospitalEmail, volunteerRequestId, applicantId, requestStatus } =
      req.body;
    const hospital = await Volunteer.findOne({
      hospitalEmail,
    });
    const volunteerRequest = hospital.volunteerRequests.find(
      (request) => request._id == volunteerRequestId
    );
    const applicant = volunteerRequest.applicants.find(
      (applicant) => applicant._id == applicantId
    );
    applicant.applicantRequestStatus = requestStatus;
    await hospital.save();
    res.send({
      status: "200",
      message: "Volunteer Request Approved Successfully",
    });
  } catch (err) {
    res.send({ status: "500", message: "Error Approving Volunteer Request" });
  }
});

export default volunteerRouter;
