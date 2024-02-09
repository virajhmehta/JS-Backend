import {v2 as cloudinary} from 'cloudinary';
import fs from "fs" // node's file system, we will mostly used for path


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return  null
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file uploaded 
        console.log("File uploaded", response.url);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved 
        // temp file as the upload opn got failed 
        return null;
    }
}

export {uploadOnCloudinary}
// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });