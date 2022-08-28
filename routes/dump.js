import Volunteer from "../models/Volunteer.js";
import express from "express";

const volunteerRouter = express.Router();

volunteerRouter.post("/postRequestForVolunteers", async (req, res) => {
  const {
    hospitalName,
    hospitalEmail,
    hospitalPhone,
    hospitalLocation,
    volunteersRequired,
    volunteerTasks,
    volunteersSkills,
    timeDuration,
    additionalNotes,
  } = req.body;

  const addvolunteer = new Volunteer({
    hospitalName,
    hospitalEmail,
    hospitalPhone,
    hospitalLocation,
    volunteersRequired,
    volunteerTasks,
    timeDuration,
    volunteersSkills,
    additionalNotes,
  });

  await addvolunteer.save();
  res.send({ status: "200", message: "Volunteer Request Added" });
});

volunteerRouter.post(
  "/fetchAllVolunteerRequestsForOneHospital",
  async (req, res) => {
    const { hospitalEmail } = req.body;
    try {
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

volunteerRouter.post("/fetchOneVolunteerRequest", async (req, res) => {
  try {
    const { id } = req.body;
    const volunteerRequest = await Volunteer.findById({ _id: id });
    res.send({
      status: "200",
      message: "Volunteer Request Fetched Successfully",
      results: volunteerRequest,
    });
  } catch (err) {
    res.send({ status: "500", message: "Error Fetching Volunteer Request" });
  }
});

volunteerRouter.delete("/deleteOneVolunteerRequest", async (req, res) => {
  const { id } = req.body;
  try {
    const volunteerRequests = await Volunteer.findByIdAndDelete({ _id: id });
    res.send({
      status: "200",
      message: "Volunteer Request Deleted Successfully",
      results: volunteerRequests,
    });
  } catch (err) {
    res.send({ status: "500", message: "Error Deleting Volunteer Request" });
  }
});

volunteerRouter.post("/applyForVolunteerRequest", async (req, res) => {
  const { id, name, email, phone, cnic } = req.body;
  try {
    const volunteerRequest = await Volunteer.findById({ _id: id });

    volunteerRequest.applicants.push({
      name,
      email,
      phone,
      cnic,
      requestStatus: "Pending",
    });
    await volunteerRequest.save();
    console.log(volunteerRequest);

    res.send({
      status: "200",
      message: "Volunteer Request Applied Successfully",
      results: volunteerRequest,
    });
  } catch (err) {
    console.log(err);
    res.send({ status: "500", message: "Error Applying Volunteer Request" });
  }
});

volunteerRouter.put("/updateVolunteerRequest", async (req, res) => {
  const { applicantId, requestStatus } = req.body;
  try {
    const applicant = await Volunteer.applicants.findById({ _id: applicantId });

    applicant.requestStatus = requestStatus;
    await applicant.save();
    res.send({
      status: "200",
      message: "Volunteer Request Updated Successfully",
      results: applicant,
    });
  } catch (err) {
    res.send({ status: "500", message: "Error Updating Volunteer Request" });
  }
});

volunteerRouter.post("/totalNumberOfVolunteerRequests", async (req, res) => {
  const { email } = req.body;

  try {
    const volunteerRequests = await Volunteer.find({ hospitalEmail: email });
    res.send({
      status: "200",
      message: "Volunteer Requests Fetched Successfully",
      data: volunteerRequests.length,
    });
  } catch (err) {
    res.send({ status: "500", message: "Error Fetching Volunteer Requests" });
  }
});

export default volunteerRouter;
