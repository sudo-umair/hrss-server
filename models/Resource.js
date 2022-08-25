import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  resourceName: {
    type: String,
    required: true,
  },
  resourceQuantity: {
    type: String,
    required: true,
  },
  resourceDuration: {
    type: String,
    required: true,
  },
  resourceNotes: {
    type: String,
    default: "No Additional Notes Provided",
  },
  userType: {
    type: String,
    required: true,
    default: "user",
  },
  requestStatus: {
    type: String,
    default: "Pending",
  },
  requestedByName: {
    type: String,
    required: true,
  },
  requestedByEmail: {
    type: String,
    required: true,
  },
  requestedByPhone: {
    type: String,
    required: true,
  },
  requestedByAddress: {
    type: String,
    required: true,
  },
  approvedByName: {
    type: String,
    default: "Pending",
  },
  approvedByPhone: {
    type: String,
    default: "Pending",
  },
  approvedByEmail: {
    type: String,
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("resources", resourceSchema);
