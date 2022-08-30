import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema({
  applicantName: {
    type: String,
    required: true,
  },
  applicantEmail: {
    type: String,
    required: true,
  },
  applicantPhone: {
    type: String,
    required: true,
  },
  applicantCnic: {
    type: String,
    required: true,
  },
  applicantRequestStatus: {
    default: "Applied",
    type: String,
    required: true,
  },
});

const VolunteerRequestSchema = new mongoose.Schema({
  volunteerRequestTitle: {
    type: String,
    required: true,
  },
  volunteersRequired: {
    type: String,
    required: true,
  },
  volunteerTasks: {
    type: String,
    required: true,
  },
  volunteersSkills: {
    type: String,
    required: true,
  },
  timeDuration: {
    type: String,
    required: true,
  },
  additionalNotes: {
    type: String,
    required: true,
  },
  requestStatus: {
    default: "Enabled",
    type: String,
    required: true,
  },
  applicants: [applicantSchema],
});

const volunteerSchema = new mongoose.Schema({
  hospitalName: {
    type: String,
    required: true,
  },
  hospitalEmail: {
    type: String,
    required: true,
    unique: true,
  },
  hospitalPhone: {
    type: String,
    required: true,
  },
  hospitalLocation: {
    type: String,
    required: true,
  },
  volunteerRequests: [VolunteerRequestSchema],
});

export default mongoose.model("volunteers", volunteerSchema);
