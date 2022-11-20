import { appId, appToken, baseUrl, baseUrlIndie } from '../constants.js';
import axios from 'axios';
import { Router } from 'express';

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
        console.log(response.data);
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
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};

export const sendNotificationToGroup = async (emails, title, body) => {
  try {
    axios
      .post(`https://app.nativenotify.com/api/indie/group/notification`, {
        subIDs: emails,
        appId: appId,
        appToken: appToken,
        title: title,
        message: body,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};
