import {Router} from "express"
import { logOutUser, loginUser, refreshAccessToken, registerUser }  from "../controllers/user.controller.js"
import upload from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"



const router = Router()


router.route("/register").post( // from app.js userRouter 
    upload.fields([
     {
        name: "avatar",
        maxCount: 1
     },
     {
        name: "coverImage",
        maxCount: 1
     }
    ]),
    registerUser) 
// we call registerUser

router.route("/login").post(loginUser)

//secured routes --> logout directly inject middleware because we have next() written at that middleware
router.route("/logout").post(verifyJWT, logOutUser)
router.route("/refresh-token").post(refreshAccessToken)






export default router