import { Router } from "express";
import Resource from "../models/Resource.js";
import { sendNotificationToUser } from "./appNotifications.js";

const resourceRouter = Router();

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
        message: "Request Failed to Post",
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

resourceRouter.put("/approveRequest", (req, res) => {
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
            const { resourceName, requestedByEmail, userType } = result;
            if (userType === "user") {
              sendNotificationToUser(
                requestedByEmail,
                "Request Approved",
                `Your request for ${resourceName} has been approved by ${approvedByName}`,
                ""
              );
            }
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

resourceRouter.post("/deleteRequest", (req, res) => {
  const { id } = req.body;
  Resource.findById({
    _id: id,
  })
    .then((resource) => {
      if (resource.requestStatus !== "Pending") {
        const { approvedByName } = resource;
        res.send({
          status: "500",
          message: "Request Already Approved By " + approvedByName,
        });
      } else {
        Resource.findByIdAndDelete(id)
          .then((result) => {
            res.send({
              status: "200",
              message: "Request Deleted Successfully",
            });
          })
          .catch((err) => {
            res.send({
              status: "500",
              message: "Request Delete Failed",
              error: err,
            });
          });
      }
    })
    .catch((err) => {
      res.send({
        status: "500",
        message: "Request Delete Failed",
        error: err,
      });
    });
});

resourceRouter.put("/ignoreRequest", (req, res) => {
  const { id, email } = req.body;

  Resource.findById(id)
    .then((resource) => {
      resource.ignoredBy.push(email);
      resource
        .save()
        .then((result) => {
          res.send({
            status: "200",
            message: "Request Ignored Successfully",
          });
        })
        .catch((err) => {
          res.send({
            status: "500",
            message: "Request Ignored Failed",
            error: err,
          });
        });
    })
    .catch((err) => {
      res.send({
        status: "500",
        message: "Request Ignored Failed",
        error: err,
      });
    });
});

export default resourceRouter;
