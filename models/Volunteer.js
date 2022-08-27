import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema({
  hospitalName: {
    type: String,
    required: true,
  },
  hospitalLocation: {
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
  timeDuration: {
    type: String,
    required: true,
  },
  volunteersSkills: {
    type: String,
    required: true,
  },
  applicants: [
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      cnic: {
        type: String,
        required: true,
      },
    },
  ],
  additionalNotes: {
    type: String,
    required: true,
  },
});

export default mongoose.model("volunteers", volunteerSchema);
