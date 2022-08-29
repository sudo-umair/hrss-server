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
    console.log(err);
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
      volunteerRequestTitle,
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
      volunteerRequestTitle,
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

volunteerRouter.post("/updateVolunteerRequest", async (req, res) => {
  try {
    const {
      hospitalEmail,
      volunteerRequestId,
      volunteerRequestTitle,
      volunteersRequired,
      volunteerTasks,
      volunteersSkills,
      timeDuration,
      additionalNotes,
    } = req.body;

    const updateVolunteerRequest = await Volunteer.findOne({
      hospitalEmail,
    });

    const volunteerRequest = updateVolunteerRequest.volunteerRequests.find(
      (volunteerRequest) => volunteerRequest._id == volunteerRequestId
    );
    volunteerRequest.volunteerRequestTitle = volunteerRequestTitle;
    volunteerRequest.volunteerTasks = volunteerTasks;
    volunteerRequest.volunteersRequired = volunteersRequired;
    volunteerRequest.volunteersSkills = volunteersSkills;
    volunteerRequest.timeDuration = timeDuration;
    volunteerRequest.additionalNotes = additionalNotes;
    await updateVolunteerRequest.save();

    res.send({
      status: "200",
      message: "Volunteer Request Updated Successfully",
    });
  } catch (err) {
    console.log(err);
    res.send({ status: "500", message: "Error Updating Volunteer Request" });
  }
});

volunteerRouter.post("/deleteVolunteerRequest", async (req, res) => {
  try {
    const { hospitalEmail, volunteerRequestId } = req.body;
    const deleteVolunteerRequest = await Volunteer.findOne({
      hospitalEmail,
    });
    const volunteerRequest = deleteVolunteerRequest.volunteerRequests.find(
      (volunteerRequest) => volunteerRequest._id == volunteerRequestId
    );
    deleteVolunteerRequest.volunteerRequests.pull(volunteerRequest);
    await deleteVolunteerRequest.save();
    res.send({
      status: "200",
      message: "Volunteer Request Deleted Successfully",
    });
  } catch (err) {
    console.log(err);
    res.send({ status: "500", message: "Error Deleting Volunteer Request" });
  }
});

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
    const {
      hospitalEmail,
      volunteerRequestId,
      applicantEmail,
      applicantName,
      applicantCnic,
      applicantPhone,
    } = req.body;
    req.body;

    const hospital = await Volunteer.findOne({
      hospitalEmail,
    });
    const volunteerRequest = hospital.volunteerRequests.find(
      (request) => request._id == volunteerRequestId
    );

    volunteerRequest.applicants.push({
      applicantName,
      applicantEmail,
      applicantPhone,
      applicantCnic,
    });
    await hospital.save();

    res.send({
      status: "200",
      message: "Volunteer Request Applied Successfully",
    });
  } catch (err) {
    console.log(err);
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

volunteerRouter.post("/fetchMyVolunteerRequests", async (req, res) => {
  try {
    const { applicantEmail } = req.body;

    const myRequests = [];
    const allRequests = await Volunteer.find();
    allRequests.forEach((hospital) => {
      hospital.volunteerRequests.forEach((request) => {
        request.applicants.forEach((applicant) => {
          if (applicant.applicantEmail == applicantEmail) {
            myRequests.push({
              hospitalId: hospital._id,
              hospitalName: hospital.hospitalName,
              hospitalEmail: hospital.hospitalEmail,
              hospitalPhone: hospital.hospitalPhone,

              requestId: request._id,
              requestTitle: request.volunteerRequestTitle,
              requestTasks: request.volunteerTasks,
              requestSkills: request.volunteersSkills,
              requestTimeDuration: request.timeDuration,
              requestAdditionalNotes: request.additionalNotes,

              applicantRequestStatus: applicant.applicantRequestStatus,
              applicantId: applicant._id,
              applicantName: applicant.applicantName,
              applicantEmail: applicant.applicantEmail,
              applicantPhone: applicant.applicantPhone,
              applicantCnic: applicant.applicantCnic,
            });
          }
        }),
          console.log(myRequests);
      });
    });
    res.send({
      status: "200",
      message: "Volunteer Requests Fetched Successfully",
      results: myRequests,
    });
  } catch (err) {
    res.send({ status: "500", message: "Error Fetching Volunteer Requests" });
  }
});

export default volunteerRouter;
