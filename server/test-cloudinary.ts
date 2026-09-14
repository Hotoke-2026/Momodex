// server/test-cloudinary.ts
import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary'
import * as fs from 'node:fs'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function run() {
  const buffer = fs.readFileSync(
    '/home/remyaubrey/workspace/20260901_084123.jpg',
  )

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'momodex-cards' },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      },
    )
    stream.end(buffer)
  })

  console.log('Success:', result)
}

run().catch((err) => console.error('Cloudinary test failed:', err))
