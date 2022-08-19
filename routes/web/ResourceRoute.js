import resourceSch from "../../models/web/ResourceSchema.js";
import express from "express";

const resource = express.Router();

resource.post("/Resources", async (req, res) => {
  const name = req.body.name;
  const resource_name = req.body.resource_name;
  const quantity = req.body.quantity;
  const duration = req.body.duration;
  const contact = req.body.contact;
  const address = req.body.address;

  const addresource = new resourceSch({
    name: name,
    resource_name: resource_name,
    quantity: quantity,
    duration: duration,
    contact: contact,
    address: address,
  });

  await addresource.save();
  res.status(201).send({ Message: "Request Added" });
  // console.log(adduser);
});

resource.get("/home", async (req, response) => {
  resourceSch.find({}, (err, result) => {
    if (err)
      // res.send(err);
      console.log("fail");
    // console.log("hello")
    else response.send(result);
    // console.log(result);
  });
});

export default resource;
