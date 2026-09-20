import express from 'express'
import * as Path from 'node:path'

import identifyRoutes from './routes/identify.ts'
import speciesRoutes from './routes/species.ts'
import cardsRoutes from './routes/cards.ts'
import usersRoutes from './routes/users.ts'
import achievementRoutes from './routes/achievementRoutes.ts'
import aiRoutes from './routes/aiRoutes.ts'

const server = express()

server.use(express.json())
server.use('/api/v1/cards', cardsRoutes)
server.use('/api/v1/identify', identifyRoutes)
server.use('/api/v1/species', speciesRoutes)
server.use('/api/v1/users', usersRoutes)
server.use('/api/v1/achievements', achievementRoutes)
server.use('/api/v1/ai', aiRoutes)

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server