// server/test-cloudinary-2.ts
import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function run() {
  const result = await cloudinary.uploader.upload(
    '/home/remyaubrey/workspace/20260901_084123.jpg', // local file path, not a buffer/stream
    { folder: 'momodex-cards' },
  )
  console.log('Success:', result)
}

run().catch((err) => console.error('Cloudinary test failed:', err))
