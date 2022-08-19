import volunteerSch from "../../models/web/VolunteerSchema.js";
import express from "express";

const volunteer = express.Router();

volunteer.post("/Volunteers", async (req, res) => {
  const name = req.body.name;
  const require_volunteer = req.body.require_volunteer;
  const task = req.body.task;
  const availability = req.body.availability;
  const duration = req.body.duration;
  const skills = req.body.skills;
  const address = req.body.address;

  const addvolunteer = new volunteerSch({
    name: name,
    require_volunteer: require_volunteer,
    task: task,
    availability: availability,
    duration: duration,
    skills: skills,
    address: address,
  });

  await addvolunteer.save();
  res.status(201).send({ Message: "Request Added" });
  // console.log(adduser);
});

volunteer.get("/Retrieve_Volunteer", async (req, response) => {
  const volunteer = volunteerSch.find({});
  try {
    response.send(volunteer);
  } catch (error) {
    response.send(error);
  }
  // , (err, result) =>{
  // if(err)
  // // res.send(err);
  // console.log('fail');

  // // console.log("hello")
  // else
  // response.send(result);
  // console.log(result);
  // })
});
export default volunteer;
