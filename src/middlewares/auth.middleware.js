import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import  jwt  from "jsonwebtoken";
import { User } from "../models/user.model";


// This middleware will verify is the user correct or not
// if res is not getting used sometime in prod grad we also use _
export const verifyJWT = asyncHandler(async(req, res, next) => {
    // using cookie access
    try {
        const token = req.cookie?.accessToken 
        || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new ApiError(401, "Unathorized request")
        }
    
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodeToken?._id).select("-password -refreshToken")
    
        if(!user){
            // TODO: discuss about frontend
            throw new ApiError(401, "Invalid Access Token")
        }
        req.user = user; 
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access Token")
    }



})