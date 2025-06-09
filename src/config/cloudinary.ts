import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: 'dtmvsodv6',
  api_key: '381594341947692',
  api_secret: '811gdr7tR04wC7VuJRZ7Joir9LE'
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