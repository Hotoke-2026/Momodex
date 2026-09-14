// server/services/cloudinaryService.ts
import { v2 as cloudinary } from 'cloudinary'
import 'dotenv/config'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Cloudinary's Node SDK wants a stream, not a plain buffer — this wraps
// the upload in a Promise so the rest of your code can just `await` it
// like any other async call.
export function uploadImageBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'momodex-cards' }, // keeps your uploads organized in one folder
      (error, result) => {
        if (error || !result) return reject(error)
        resolve(result.secure_url) // the hosted https URL Gemini/your DB will use
      },
    )
    uploadStream.end(buffer)
  })
}
