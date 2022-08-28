import { appId, appToken, baseUrl } from "../constants.js";
import axios from "axios";
import { Router } from "express";

const appNotificationsRouter = Router();

appNotificationsRouter.post("/sendNotificationToAll", (req, res) => {
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

export default appNotificationsRouter;
