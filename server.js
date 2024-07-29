import express from 'express'
import { config } from 'dotenv'
import authRoutes from './routes/auth.js'
import authUrlRoutes from './routes/auth-url.js'
import profilePictureRoutes from './routes/profile-picture.js'
import streamsRoutes from './routes/streams.js'
import userRoutes from './routes/user.js'
import cors from 'cors'

config()

const app = express()
const PORT = process.env.PORT || '5000'

app.use(
    cors({
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true,
    })
)

app.use(express.json())

app.use('/api', authRoutes)
app.use('/api', authUrlRoutes)
app.use('/api', profilePictureRoutes)
app.use('/api', streamsRoutes)
app.use('/api', userRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
