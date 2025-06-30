import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
    // Configuration
cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // Accepts video, image, raw, etc.
        });

        // Optional: you can log or return the response
        console.log("File uploaded successfully:", response.url);4
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
};

export {uploadOnCloudinary};

// const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResult);