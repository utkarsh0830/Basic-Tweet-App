import jwt from "jsonwebtoken"
import {User} from "../model/user.js"


const verifyJWT = async (req,res,next)=> {
    try {
        
        const token = req.header('Authorization')?.replace("Bearer ","") || req.cookies?.accessToken ;

        if (!token) {
            return res.status(401).json({ message: "❌ Access token is missing" });
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) return res.status(404).send({ message: "User not found" });

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: "❌ Token validation failed" });
    }
}

export default verifyJWT