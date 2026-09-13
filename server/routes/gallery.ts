import { Router, Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'

import * as db from '../db/gallery.ts'
import { checkJwt } from '../middleware/authMiddleware.ts'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only jpg, png, and gif files are allowed'))
    }
  },
})

const router = Router()

router.post('/', checkJwt, upload.single('image'), async (req, res) => {
  try {

    const userId = req.auth?.payload?.sub

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' })
    }

    const file = req.file

    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (error || !result) reject(error ?? new Error('Upload failed'))
          else resolve(result)
        })
        stream.end(file.buffer)
      },
    )

    const image = await db.createGalleryImage({
      user_id: userId, // Authenticated user
      image_url: uploadResult.secure_url,
      caption: req.body.caption,
    })

    res.status(201).json(image)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.get('/', async (req, res) => {
  try {
    const images = await db.getAllGalleryImages()

    res.json({ images })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (
    error instanceof multer.MulterError ||
    error.message.includes('Only jpg')
  ) {
    return res.status(400).json({ message: error.message })
  }
  next(error)
})

export default router
