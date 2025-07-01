import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
        cloud_name: 'prithviraj',
        api_key: '969837326381826', 
        api_secret: 'KnAus8uoKQJrd8xjzV4f_kuYswc' // Click 'View API Keys' above to copy your API secret
})


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