const { createChallenge, verifySolution } = require('altcha-lib');

export default async function handler(req, res) {
    const hmacKey = process.env.ALTCHA_SECRET || 'fallback-secret-for-testing';

    // 1. If the browser asks for a challenge (GET)
    if (req.method === 'GET') {
        const challenge = await createChallenge({
            hmacKey: hmacKey,
            maxNumber: 50000, // Difficulty level
        });
        return res.json(challenge);
    }

    // 2. If the browser submits the form (POST)
    if (req.method === 'POST') {
        const { altcha_payload } = req.body;
        const isValid = await verifySolution(altcha_payload, hmacKey);

        if (isValid) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(400).json({ success: false, error: 'Invalid CAPTCHA' });
        }
    }

    return res.status(405).send('Method Not Allowed');
}
