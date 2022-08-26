import { Router } from "express";
import Resource from "../models/Resource.js";
import axios from "axios";

const resourceRouter = Router();

const appId = 3686;
const appToken = "bSmfQdmZN8TAxKjrJdk7Px";
const baseUrl = "https://app.nativenotify.com/api/indie/notification";

const sendNotificationToRequester = async (
  requesterEmail,
  approverName,
  resourceName
) => {
  try {
    axios
      .post(baseUrl, {
        subID: requesterEmail,
        appId: appId,
        appToken: appToken,
        title: "Request Approved",
        message: `Your request for ${resourceName} has been approved by ${approverName}`,
        pushData: '{ "screenName": "Resources" }',
      })
      .then((response) => {
        // console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};

resourceRouter.post("/postRequest", (req, res) => {
  const {
    userType,
    resourceName,
    resourceQuantity,
    resourceDuration,
    requestedByName,
    requestedByEmail,
    requestedByPhone,
    requestedByAddress,
    resourceNotes,
  } = req.body;

  const newResource = new Resource({
    userType,
    resourceName,
    resourceQuantity,
    resourceDuration,
    resourceNotes,
    requestedByName,
    requestedByEmail,
    requestedByPhone,
    requestedByAddress,
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
      console.log(err);
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

  Resource.find({ requestedByEmail: email })
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

resourceRouter.put("/updateRequest", (req, res) => {
  const {
    id,
    requestStatus,
    approvedByName,
    approvedByEmail,
    approvedByPhone,
  } = req.body;

  Resource.findById(id)
    .then((resource) => {
      if (resource.requestStatus !== "Pending") {
        const { approvedByName } = resource;
        res.send({
          status: "500",
          message: "Request Already Approved By " + approvedByName,
        });
      } else {
        Resource.findByIdAndUpdate(id, {
          requestStatus,
          approvedByName,
          approvedByPhone,
          approvedByEmail,
        })
          .then((result) => {
            const { resourceName, requestedByEmail } = result;
            sendNotificationToRequester(
              requestedByEmail,
              approvedByName,
              resourceName
            );
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
      }
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
