import {User} from './model/user.js'
import jwt from "jsonwebtoken"
import mongoose from 'mongoose'

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if(!user){
            console.log("User not found with the provided userId");
            return res.status(404).json({
                message: "User does not exists"
            })
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save();

        return {accessToken,refreshToken};

    } catch (error) {
        console.error("Error generating tokens:", error);  
        return res.status(500).json({
            message: "Something Went Wrong while generating refresh and access token"
        });
    }

    
}

const registerUser = async (req,res) => {
    try {
        const {username,email,name,password} = req.body;

        if(username == "" || email == "" || name == "" || password == ""){
            return res.status(400).json({message:"Please fill all the fields"})
        }

        const existedUser = await User.findOne({
            $or: [{email},{username}]
        })

        if(existedUser){
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const user = await User.create({
            username,
            email,
            name,
            password
        })

        const createdUser = await User.findById(user._id).select("-password -refreshToken");
        if(!createdUser){
            return res.status(500).json({
                message: "Something went wrong while creating a user"
            });
        }

        res.status(201).json({
            message:"User Registered Successfully"
        })

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const loginUser = async (req,res) => {
    try {
        const {email,password} = req.body;
        if(email == ""){
            return res.status(400).json({message:"Username or Email is required"})
        }

        const user = User.findOne({
            $or: [{username},{email}]
        })

        if(!user){
            return res.status(404).json({
                message: "User does not exists"
            })
        }

        const isPasswordCorrect = User.isPasswordCorrect(password);
        if(!isPasswordCorrect){
            return res.status(401).json({
                message: "Invalid Credentials"
            })
        }

        const {accessToken,refreshToken} = generateAccessAndRefreshToken(user._id);

        const loggedInUser = User.findById(user._id).select("-refreshToken -password").lean();

        const options = {
            httpOnly:true,
            //secure:true
        }

        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            {
                message:"User logged in successfully",
                user:loggedInUser,
                accessToken:accessToken,
                refreshToken:refreshToken

            }
        )

    } catch (error) {
        console.log("Login Error",error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export {loginUser, registerUser};