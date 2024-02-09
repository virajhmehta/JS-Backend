import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true, 
        index: true // to make it searchable
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowecase: true,
        trim: true, 
    },
    fullName: {
        type: String,
        required: true,
        trim: true, 
        index: true
    },
    avatar: {
        type: String, // cloudinary url
        required: true,
    },
    coverImage: {
        type: String, // cloudinary service url
    },
    watchHistory: [ // it will have multiple value so array
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String, 
        required: [true, 'Password is required']
    },
    refreshToken : {
        type: String
    }
},{timestamps: true})


userSchema.pre("save", async function(next){
    if(this.isModified("password")) return next(); // we have to pass string in isModified()
    // we will save when it is modified not on every time any change like avatar
    this.password = await bcrypt.hash(this.password, 10)
    next()
})


//we can inject methods with the mongoose, it is having method object
userSchema.methods.ispasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password) // in the argument we have to pass password 
    // and encrypted password 
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({ // sign method to generate the token
        _id: this._id,
        email : this.email,
        username : this.username,
        fullName : this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }
    )

}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id,
        
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}

export const User = mongoose.model("User", userSchema);
