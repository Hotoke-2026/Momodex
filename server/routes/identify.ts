import { Router } from 'express'
import multer from 'multer'
import { identifyController } from './identifyController'
import { checkJwt } from '../middleware/authMiddleware'

const router = Router()

// memoryStorage keeps the uploaded file as a Buffer in RAM (req.file.buffer)
// rather than writing it to disk — since we're immediately forwarding it to
// Cloudinary, there's no reason to touch the filesystem at all.
const upload = multer({ storage: multer.memoryStorage() })

router.post('/', checkJwt, upload.single('image'), identifyController)

export default router
