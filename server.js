import express from 'express'
import fetch from 'node-fetch'
import { config } from 'dotenv'

config()

const app = express()
const PORT = process.env.PORT || '5000'
const CLIENT_ID = process.env.CLIENT_ID || ''
const CLIENT_SECRET = process.env.CLIENT_SECRET || ''
const ADDRESS = process.env.ADDRESS || 'http://localhost:3000'

app.use(express.json())

app.get('/api/auth', async (_req, res) => {
    const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`

    try {
        const response = await fetch(url, {
            method: 'POST',
        })
        if (!response.ok) throw new Error(`${response.status}`)
        const data = await response.json()
        res.json(data)
    } catch (error) {
        console.error(
            'The following error occurred during the Authorization:',
            error
        )
        res.status(500).json({ error: error.message })
    }
})

app.get('/api/auth-url', (req, res) => {
    const { state } = req.query
    if (!state) {
        return res
            .status(400)
            .json({ error: 'Missing required parameter: state' })
    }
    const url = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${ADDRESS}&state=${state}&scope=user:read:email`
    res.json({ url })
})

app.post('/api/profile-picture', async (req, res) => {
    const { access_token, token_type, user_id } = req.body

    if (!access_token || !token_type || !user_id) {
        return res.status(400).json({ error: 'Missing required parameters' })
    }

    const url = `https://api.twitch.tv/helix/users?id=${user_id}`
    const authorization = `${token_type} ${access_token}`

    const headers = {
        authorization,
        'Client-ID': CLIENT_ID,
    }

    try {
        const response = await fetch(url, {
            headers,
            method: 'GET',
        })
        if (!response.ok) throw new Error(`${response.status} ${response.url}`)
        const data = await response.json()
        const imageUrl = data.data[0].profile_image_url
        res.json({ imageUrl })
    } catch (error) {
        console.error(
            'The following error occurred while fetching a user profile picture for the user:',
            user_id,
            error
        )
        res.status(500).json({ error: 'Failed to fetch profile picture' })
    }
})

app.post('/api/streams', async (req, res) => {
    const { access_token, token_type, url } = req.body

    if (!access_token || !token_type || !url) {
        return res.status(400).json({ error: 'Missing required parameters' })
    }

    const authorization = `${token_type} ${access_token}`

    const headers = {
        authorization,
        'Client-ID': CLIENT_ID,
    }

    try {
        const response = await fetch(url, {
            headers,
            method: 'GET',
        })

        if (!response.ok) throw new Error(`${response.status} ${response.url}`)

        const data = await response.json()
        res.json(data)
    } catch (error) {
        console.error(
            'The following error occurred while fetching streams:',
            error
        )
        res.status(500).json({ error: error.message })
    }
})

app.post('/api/user', async (req, res) => {
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

    const headers = {
        authorization,
        'Client-ID': CLIENT_ID,
    }

    try {
        const response = await fetch(url, {
            headers,
            method: 'GET',
        })

        if (!response.ok) throw new Error(`${response.status} ${response.url}`)

        const data = await response.json()

        if (!data.data.length) {
            return res
                .status(404)
                .json({ error: 'No user has been found found' })
        }

        res.json(data.data[0])
    } catch (error) {
        console.error('Error fetching user data:', error)
        res.status(500).json({ error: error.message })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
