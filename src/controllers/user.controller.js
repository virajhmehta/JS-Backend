import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // storing refresh token into db
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false}) // directly save don't validate

        return {accessToken, refreshToken} 

        

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access Token")
    }
}

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
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // user exists  from db
    const existedUser = await  User.findOne({
        $or: [{username}, {email}]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username exist");
    }

    console.log(req.files);
    // check for images, avatar
    let avatarLocalPath = req.files?.avatar[0]?.path;
    // let coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    } // if we file and proper array or not 

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar path File is required")
    }

    // upload to the cloudinary
    // it will give localFilePath that pass in defined cloudinary method

    let avatar = await uploadOnCloudinary(avatarLocalPath)
    let coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // checking avatar

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }


    // db entry
    const user = await User.create({
        fullName,
        avatar: avatar.url, // storing url in db
        coverImage: coverImage?.url || "", // checking here since it is optional not like avatar
        email,
        password,
        username: username.toLowerCase()
    })

    // remove passs and refresh token
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    // using select method we write that we don't want
    
    if(!createdUser)
        throw  new ApiError(500, "Something went wrong while registring")

    // above is for if found issue while creating user


    // Now crafting response

    return res.status(201).json( // created new obj and passing method acc to defined method
        new ApiResponse(200,  createdUser, "User registered Succesfully")
    )
})

const loginUser = asyncHandler (async(req, res) => {
    // req body -> data
    // username or email based login
    // find the user
    // pass check
    // access and refresh token
    // send cookie

    const {email, username, password} = req.body
    if(!username || !email){
        throw new ApiError(400, "Username or Email is required")
    }


    // user find
    const user = await User.findOne({
        $or: [{username}, {email}] // we will try to find with username or email
    })

    if(!user){
        throw new ApiError(404, "Error does not Exixst");
    }
    // pass check

    const isPasswordValid = await user.isPasswordCorrect(password) // from usermodel
    if(!isPasswordValid){
        throw new ApiError(401, "Password incorrect");
    }

    // access and refresh token
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)


    
    const loggedInUser = User.findById(user._id)
    select("-password -refreshToken")

    // cookie 
    const option = {
        httpOnly: true,
        secure: true,
        
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, option) // setting cookie
    .cookie("refreshToken", refreshToken, option) 
    .json(
        new ApiResponse(200,{
            user: loggedInUser, accessToken, refreshToken 
        },
        "User Logged in Successfully"
      )
    )


})

const logOutUser = asyncHandler (async(req, res) => {
    // How to logout
    // clear cookie and reset refreshToken
    
    // earlier we r doing something by taking email, username 
    // but at the time logout we can't ask user again this thing  

    // so we need middleware 

    // cleared refreshtoken
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )  

    // cookie clear
    const option = {
        httpOnly: true,
        secure: true,
        
    }

    return res
    .status(200)
    .clearCookie("accessToken", option) 
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User Logged out"))




})



export { registerUser, loginUser, logOutUser }