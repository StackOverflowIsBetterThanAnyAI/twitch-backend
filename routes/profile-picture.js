import express from 'express'
import fetch from 'node-fetch'

const router = express.Router()
const CLIENT_ID = process.env.CLIENT_ID

router.post('/profile-picture', async (req, res) => {
    const { access_token, token_type, user_id } = req.body

    if (!access_token || !token_type || !user_id) {
        return res.status(400).json({ error: 'Missing required parameters' })
    }

    const url = `https://api.twitch.tv/helix/users?id=${user_id}`
    const authorization = `${token_type} ${access_token}`

    const headers = { authorization, 'Client-ID': CLIENT_ID }

    try {
        const response = await fetch(url, { headers, method: 'GET' })
        if (!response.ok) throw new Error(`${response.status} ${response.url}`)
        const data = await response.json()
        const imageUrl = data.data[0].profile_image_url
        res.json({ imageUrl })
    } catch (error) {
        console.error('Profile picture error:', error)
        res.status(500).json({ error: 'Failed to fetch profile picture' })
    }
})

export default router
