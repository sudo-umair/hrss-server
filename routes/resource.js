import { Router } from "express";
import Resource from "../models/Resource.js";

const resourceRouter = Router();

resourceRouter.post("/postRequest", (req, res) => {
  const {
    name,
    email,
    userType,
    resourceName,
    quantity,
    duration,
    phone,
    address,
    notes,
  } = req.body;
  console.log(req.body);

  const newResource = new Resource({
    name,
    email,
    userType,
    resourceName,
    quantity,
    duration,
    phone,
    address,
    notes,
  });

  newResource
    .save()
    .then((result) => {
      res.send({
        status: "201",
        message: "Request Posted Successfully",
      });
    })
    .catch((err) => {
      res.send({
        status: "500",
        message: "Request Failed",
        error: err,
      });
    });
});

resourceRouter.post("/fetchRequests", (req, res) => {
  const { userType } = req.body;
  if (userType === "user") {
    // fetch requests where userType is user and email not equal to email and status is pending
    Resource.find({
      userType: "user",
    })
      .then((result) => {
        // console.log(result);
        res.send({
          status: "200",
          message: "Requests Fetched Successfully",
          results: result,
        });
      })
      .catch((err) => {
        res.send({
          status: "500",
          message: "Requests Failed",
          error: err,
        });
      });
  } else if (userType === "hospital") {
    Resource.find({})
      .then((result) => {
        res.send({
          status: "200",
          message: "Requests Fetched Successfully",
          data: result,
        });
      })
      .catch((err) => {
        res.send({
          status: "500",
          message: "Requests Failed",
          error: err,
        });
      });
  }
});

resourceRouter.post("/totalNumberOfRequests", (req, res) => {
  const { email } = req.body;

  Resource.find({ email })
    .then((resources) => {
      res.send({
        status: "200",
        message: "Requests Fetched Successfully",
        data: resources.length,
      });
    })
    .catch((err) => {
      res.send({ status: "500", message: "Error Fetching Requests" });
    });
});

resourceRouter.get("/fetchRequestsByEmail", (req, res) => {
  const { email } = req.body;

  Resource.find({ email })
    .then((resources) => {
      res.send({
        status: "200",
        message: "Requests Fetched Successfully",
        data: resources,
      });
    })
    .catch((err) => {
      res.send({ status: "500", message: "Error Fetching Requests" });
    });
});

resourceRouter.put("/updateRequest", (req, res) => {
  const { id, requestStatus, requestApprovedByName, requestApprovedByPhone } =
    req.body;
  Resource.findByIdAndUpdate(id, {
    requestStatus,
    requestApprovedByName,
    requestApprovedByPhone,
  })
    .then((result) => {
      res.send({
        status: "200",
        message: "Request Updated Successfully",
      });
    })
    .catch((err) => {
      res.send({
        status: "500",
        message: "Request Update Failed",
        error: err,
      });
    });
});

resourceRouter.get("/home", async (req, response) => {
  resourceSch.find({}, (err, result) => {
    if (err)
      // res.send(err);
      console.log("fail");
    // console.log("hello")
    else response.send(result);
    // console.log(result);
  });
});

export default resourceRouter;
