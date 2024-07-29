import express from 'express'
import fetch from 'node-fetch'

const router = express.Router()
const CLIENT_ID = process.env.CLIENT_ID

router.post('/streams', async (req, res) => {
    const { access_token, token_type, url } = req.body

    if (!access_token || !token_type || !url) {
        return res.status(400).json({ error: 'Missing required parameters' })
    }

    const authorization = `${token_type} ${access_token}`

    const headers = { authorization, 'Client-ID': CLIENT_ID }

    try {
        const response = await fetch(url, { headers, method: 'GET' })
        if (!response.ok) throw new Error(`${response.status} ${response.url}`)
        const data = await response.json()
        res.json(data)
    } catch (error) {
        console.error('Streams error:', error)
        res.status(500).json({ error: error.message })
    }
})

export default router
