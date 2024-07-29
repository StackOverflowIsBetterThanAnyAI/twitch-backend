import express from 'express'
import fetch from 'node-fetch'

const router = express.Router()
const CLIENT_ID = process.env.CLIENT_ID

router.post('/user', async (req, res) => {
    const { access_token, access_state, random_state } = req.body

    if (!access_token || !access_state || !random_state) {
        return res.status(400).json({ error: 'Missing required parameters' })
    }

    const sameState = random_state === access_state
    if (!sameState) {
        return res.status(400).json({ error: 'State mismatch' })
    }

    const url = 'https://api.twitch.tv/helix/users'
    const authorization = `Bearer ${access_token}`

    const headers = { authorization, 'Client-ID': CLIENT_ID }

    try {
        const response = await fetch(url, { headers, method: 'GET' })
        if (!response.ok) throw new Error(`${response.status} ${response.url}`)
        const data = await response.json()
        if (!data.data.length) {
            return res.status(404).json({ error: 'No user found' })
        }
        res.json(data.data[0])
    } catch (error) {
        console.error('User error:', error)
        res.status(500).json({ error: error.message })
    }
})

export default router
