import { Router } from "express";
import Resource from "../models/Resource.js";

const resourceRouter = Router();

resourceRouter.post("/postRequest", (req, res) => {
  const { email, userType, resource, quantity, duration, phone, address } =
    req.body;
  console.log(req.body);

  const newResource = new Resource({
    email,
    userType,
    resource,
    quantity,
    duration,
    phone,
    address,
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

resourceRouter.get("/fetchRequests", (req, res) => {
  Resource.find()
    .then((resources) => {
      res.send({ status: "200", message: resources });
    })
    .catch((err) => {
      res.send({ status: "500", message: "Error Fetching Requests" });
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
