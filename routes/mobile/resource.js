import { Router } from "express";
import Resource from "../../models/mobile/Resource.js";

const resourceRouter = Router();

resourceRouter.post("/postRequest", (req, res) => {
  const { email, resource, quantity, duration, phone, address } = req.body;
  console.log(req.body);

  const newResource = new Resource({
    email,
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

export default resourceRouter;
