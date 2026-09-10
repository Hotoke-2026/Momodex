import express from 'express'
import * as Path from 'node:path'
import galleryRoutes from './routes/gallery.ts'
import cardRoutes from '../server/routes/cardRoutes.ts'

import fruitRoutes from './routes/fruits.ts'
import identifyRoutes from './routes/identify.ts'
import speciesRoutes from './routes/species.ts'

const server = express()

server.use(express.json())
server.use('/api/v1/gallery', galleryRoutes)

server.use('/api/cards', cardRoutes)
server.use('/api/v1/fruits', fruitRoutes)
server.use('/api/v1/identify', identifyRoutes)
server.use('/api/v1/species', speciesRoutes)

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server
