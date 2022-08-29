import { appId, appToken, baseUrl } from "../constants.js";
import axios from "axios";
import { Router } from "express";

import { appId, appToken, baseUrl } from "../constants.js";

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
        console.log(response);
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
    axios
      .post(baseUrl, {
        appId,
        appToken,
        title,
        body,
        pushData,
      })
      .then((response) => {
        res.send("Notification sent successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
});

appNotificationsRouter.post("/sendNotificationToOneUser", (req, res) => {
  const { userId, title, message, pushData } = req.body;
  try {
    sendNotificationToUser(userId, title, message, pushData);
    res.send("Notification sent successfully");
  } catch (error) {
    console.log(error);
  }
});

export default appNotificationsRouter;
