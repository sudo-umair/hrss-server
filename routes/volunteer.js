import Volunteer from "../models/Volunteer.js";
import express from "express";

const volunteerRouter = express.Router();

volunteerRouter.post("/requestForVolunteers", async (req, res) => {
  const {
    hospitalName,
    hospitalLocation,
    volunteersRequired,
    volunteerTasks,
    timeDuration,
    volunteersSkills,
    additionalNotes,
  } = req.body;

  const addvolunteer = new Volunteer({
    hospitalName,
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

volunteerRouter.get("/fetchVolunteerRequests", async (req, res) => {
  try {
    const volunteerRequests = await Volunteer.find();
    res.send({
      status: "200",
      message: "Volunteer Requests Fetched Successfully",
      results: volunteerRequests,
    });
  } catch (err) {
    res.send({ status: "500", message: "Error Fetching Volunteer Requests" });
  }
});

volunteerRouter.delete("/deleteVolunteerRequest", async (req, res) => {
  const { id } = req.body;
  try {
    const volunteerRequests = await Volunteer.findByIdAndDelete(id);
    res.send({
      status: "200",
      message: "Volunteer Request Deleted Successfully",
      results: volunteerRequests,
    });
  } catch (err) {
    res.send({ status: "500", message: "Error Deleting Volunteer Request" });
  }
});

volunteerRouter.post("applyForVolunteer", async (req, res) => {
  const { id, name, email, phone, cnic } = req.body;
  try {
    // const volunteerRequests = await Volunteer.findByIdAndUpdate(
    //   id,
    //   {
    //     $push: {
    //       volunteers: {
    //         name,
    //         email,
    //         phone,
    //         cnic,
    //       },
    //     },
    //   },
    //   { new: true }
    // );

    // const volunteerRequests = await Volunteer.applicant.insert ({
    //   name,
    //   email,
    //   phone,
    //   cnic,
    // });

    res.send({
      status: "200",
      message: "Volunteer Request Applied Successfully",
      results: volunteerRequests,
    });
  } catch (err) {
    res.send({ status: "500", message: "Error Applying Volunteer Request" });
  }
});

volunteerRouter.get("/retrieveVolunteerRequests", async (req, res) => {
  const volunteer = Volunteer.find({});
  try {
    res.send(volunteer);
  } catch (error) {
    res.send(error);
  }
});
export default volunteerRouter;
