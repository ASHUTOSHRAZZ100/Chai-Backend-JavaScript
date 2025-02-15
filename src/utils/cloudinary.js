import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

 // Configuration
 cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async(localFilePath)=>{
    try {
        if(!localFilePath) return null;
        
        // Upload the file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto",
        });

        // File has been uploaded successfull
        // console.log('file is uploaded an cloudinary',response.url);
        fs.unlinkSync(localFilePath) // remove the saved the temporary file as the upload operation got success
        return response;        
    } catch (error) {
       fs.unlinkSync(localFilePath) // remove the saved the temporary file as the upload operation got failed
       return null;
    }
}

export {uploadOnCloudinary} ;