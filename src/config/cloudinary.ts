import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Validate environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Cloudinary credentials are not properly configured in environment variables');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: 'auto', // This allows both image and video uploads
    allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'mov', 'avi'],
    transformation: [
      { width: 1920, height: 1080, crop: 'limit' } // Limit video size
    ]
  } as any, // Using type assertion to bypass TypeScript restrictions
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

export { cloudinary, upload }; 