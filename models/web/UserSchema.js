import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    con_password: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12)
        this.con_password = await bcrypt.hash(this.con_password, 12)
    }
    next();
})

//Generating Token
userSchema.methods.generateToken = async function () {
    try {
        console.log(process.env.SECRET_TOKEN)
        let token =jwt.sign({ _id: this._id }, `${process.env.SECRET_TOKEN}`)
        this.tokens = this.tokens.concat({ token: token })
        await this.save();
        return token; 

    } catch (error) {
        console.log(error)
    }
}

const user = new mongoose.model("users", userSchema);
console.log('schema')

export default user;
