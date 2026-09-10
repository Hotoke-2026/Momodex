// server/routes/identify.ts
import { Router } from 'express'
import { identifyController } from './identifyController'

const router = Router()

router.post('/', identifyController)

export default router
