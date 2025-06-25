import { User } from '../model/user.js';
import jwt from "jsonwebtoken";


const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found with the provided userId");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};


const registerUser = async (req, res) => {
  try {
    const { username, email, name, password } = req.body;

    if (!username || !email || !name || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const existedUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existedUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({ username, email, name, password });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
      return res.status(500).json({
        message: "Something went wrong while creating a user",
      });
    }

    return res.status(201).json({
      message: "User Registered Successfully",
      user: createdUser,
    });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email && !username) {
      return res.status(400).json({ message: "Username or Email is required" });
    }

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-refreshToken -password").lean();

    const options = {
      httpOnly: true,
      // secure: true  // enable in production with HTTPS
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "User logged in successfully",
        user: loggedInUser,
        accessToken,
        refreshToken,
      });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCurrentUser = (req,res) => {
  return res.status(200).json(
    req.user,
    "Current User Fetched Successfully"
  )
}

const getAllUsers = async (req,res) => {
  try {
    const users = await User.find().select("-password -refreshToken").lean();
    return res.status(200).json({
      message: "All users Fetched Successfully",
      users
    });

    } catch (error) {
      res.status(401).json({
        message: "Error fetching users"
      });
    }
}

const logOut = async (req,res) => {
  try {
    
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId,{
      $unset: {
        refreshToken: 1
      }
    },{new: true});

    const options = {
      httpOnly:true
    }
    
    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json({
      message: "User logged out successfully"
    });

  } catch (error) {
    return res.status(400).json({
      message : "Failed to logout"
    })
  }
}

export { loginUser, registerUser,getCurrentUser,getAllUsers,logOut};
