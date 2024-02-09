import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser  = asyncHandler(async (req, res) => {
    // res.status(200).json({
    //     message: "Hello"
    // })

    // steps to register
    // get user details from frontend depends on model
    // validation -> not empty
    // check if user already exist: check by username, email
    // check for images, check for avtar
    // upload them to cloudinary, check avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response 


    // get user details from frontend depends on model
    const {fullName, email, username, password} = req.body
    console.log("email:", email);

    // if (fullName === "") {
    //     throw new ApiError(400, "fullname is required")
    // } for checking we have to write for each and everyone rather than 
    // that we can write using some method

    // like this we can write many validation, exa: for email is having @ or not
    if(
        [fullName, email, username, password].some((field) => field?.trim() === ""
        )
    ){
        throw new ApiError(400, "All fields are required")
    }

    // user exists  from db
    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username exist");
    }

    // check for images, avatar
    const avatarLocalPath = req.files?.avtar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avtar File is required")
    }

    // upload to the cloudinary
    // it will give localFilePath that pass in defined cloudinary method

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // checking avatar

    if (!avatar) {
        throw new ApiError(400, "Avtar File is required")
    }


    // db entry
    const user = await User.create({
        fullName,
        avatar: avtar.url, // storing url in db
        coverImage: coverImage?.url || "", // checking here since it is optional not like avatar
        email,
        password,
        username: username.toLowerCase()
    })

    // remove passs and refresh token
    const createdUSer = await User.findById(user._id).select(
        "-password -refresToken"
    )
    // using select method we write that we don't want
    
    if(!createdUSer)
        throw  new ApiError(500, "Something went wrong while registring")

    // above is for if found issue while creating user


    // Now crafting response

    return res.status(201).json( // created new obj and passing method acc to defined method
        new ApiResponse(200,  createdUSer, "User registered Succesfully")
    )




     


})

export default registerUser