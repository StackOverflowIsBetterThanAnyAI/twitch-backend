import express from 'express'
import fetch from 'node-fetch'
import { config } from 'dotenv'

config()
const router = express.Router()

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

router.get('/auth', async (_req, res) => {
    const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`

    try {
        const response = await fetch(url, { method: 'POST' })
        if (!response.ok) throw new Error(`${response.status}`)
        const data = await response.json()
        res.json(data)
    } catch (error) {
        console.error('Authorization error:', error)
        res.status(500).json({ error: error.message })
    }
})

export default router
