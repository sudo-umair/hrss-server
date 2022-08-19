import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    resource_name:{
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    duration:{
        type: String,
        required: true
    },
    contact:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    }
})

const resourceSch = new mongoose.model("resources", resourceSchema);


export default resourceSch;