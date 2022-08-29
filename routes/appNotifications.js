import { appId, appToken, baseUrl, baseUrlIndie } from "../constants.js";
import axios from "axios";
import { Router } from "express";

export const sendNotificationToUser = async (
  userId,
  title,
  message,
  pushData
) => {
  try {
    axios
      .post(baseUrlIndie, {
        subID: userId,
        appId,
        appToken,
        title,
        message,
        pushData,
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

export const sendNotificationToAll = async (title, body, pushData) => {
  try {
    axios
      .post(baseUrl, {
        appId,
        appToken,
        title,
        body,
        pushData,
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

const appNotificationsRouter = Router();

appNotificationsRouter.post("/sendNotificationToAllUsers", (req, res) => {
  const { title, body, pushData } = req.body;
  try {
    sendNotificationToAll(title, body, pushData);
    res.send({
      message: "Notification Sent Successfully",
    });
  } catch (error) {
    console.log(error);
    res.send({
      message: "Notification Failed",
      error: error,
    });
  }
});

appNotificationsRouter.post("/sendNotificationToOneUser", (req, res) => {
  const { userId, title, message, pushData } = req.body;
  try {
    sendNotificationToUser(userId, title, message, pushData);
    res.send({ message: "Notification sent successfully" });
  } catch (error) {
    console.log(error);
    res.send({ message: "Notification failed", error: error });
  }
});

export default appNotificationsRouter;
