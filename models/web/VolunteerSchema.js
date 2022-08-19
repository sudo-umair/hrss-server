import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    require_volunteer:{
        type: String,
        required: true
    },
    task:{
        type: String,
        required: true
    },
    availability:{
        type: String,
        required: true
    },
    duration:{
        type: String,
        required: true
    },
    skills:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    }
})

const volunteerSch = new mongoose.model("volunteers", volunteerSchema);


export default volunteerSch;