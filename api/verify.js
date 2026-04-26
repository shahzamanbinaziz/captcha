const { createChallenge, verifySolution } = require('altcha-lib');

export default async function handler(req, res) {
    // Enable CORS so your website can talk to this API
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all sites (or put your domain here)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle the browser's "pre-flight" check
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const hmacKey = process.env.ALTCHA_SECRET || 'test-secret-key';

    if (req.method === 'GET') {
        try {
            const challenge = await createChallenge({
                hmacKey: hmacKey,
                maxNumber: 50000,
            });
            return res.json(challenge);
        } catch (err) {
            return res.status(500).json({ error: 'Failed to create challenge' });
        }
    }

    if (req.method === 'POST') {
        const { altcha_payload } = req.body;
        const isValid = await verifySolution(altcha_payload, hmacKey);
        if (isValid) return res.status(200).json({ success: true });
        return res.status(400).json({ success: false });
    }
}
