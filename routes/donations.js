import { Router } from "express";
import Donation from "../models/Donation.js";

const donationRouter = Router();

donationRouter.get("/getDonationsList", (req, res) => {
  Donation.find({}, (err, donations) => {
    if (err) {
      res.send({
        status: "500",
        message: "Error Fetching Donations",
        error: err,
      });
    }
    res.send({
      status: "200",
      message: "Data fetched successfully",
      results: donations,
    });
  });
});

export default donationRouter;
