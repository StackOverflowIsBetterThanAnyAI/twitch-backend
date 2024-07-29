import express from 'express'

const router = express.Router()
const CLIENT_ID = process.env.CLIENT_ID
const ADDRESS = process.env.ADDRESS

router.get('/auth-url', (req, res) => {
    const { state } = req.query
    if (!state) {
        return res
            .status(400)
            .json({ error: 'Missing required parameter: state' })
    }
    const url = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${ADDRESS}&state=${state}&scope=user:read:email`
    res.json({ url })
})

export default router
