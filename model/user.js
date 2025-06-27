import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    name: {
        type: String,
        
    },
    password: {
        type: String,
        required: [true,"Password is required"]

    },
    refreshTokens: {
        type: String,
    }
},{timestamps: true})

userSchema.pre(
    "save", async function name(next) {
        if(!this.isModified("password")) return next();

        this.password = await bcrypt.hash(this.password,10)
        next()
    }) //jo bhi code execute karwana hai save hone se pehle use pre hooks

    //This is used to generate our custom methods
    userSchema.methods.isPasswordCorrect = async function(password) {
        return await bcrypt.compare(password, this.password);
    }

    userSchema.methods.generateAccessToken = function(){
        return jwt.sign({
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    ) //this generate access token and inside it we keep or payload info
    }
    userSchema.methods.generateRefreshToken = function(){
        return jwt.sign({
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
        ) //this generate refresh token and inside it we keep or payload info
    }

export const User = mongoose.model('User',userSchema);