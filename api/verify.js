const { createChallenge, verifySolution } = require('altcha-lib');

export default async function handler(req, res) {
    // 1. Add Headers to prevent CORS blocks
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // 2. Use a fallback secret so it doesn't crash if Vercel variable is missing
    const hmacKey = process.env.ALTCHA_SECRET || 'a_permanent_random_secret_string_here';

    try {
        if (req.method === 'GET') {
            const challenge = await createChallenge({
                hmacKey: hmacKey,
                maxNumber: 50000,
            });
            return res.status(200).json(challenge);
        }

        if (req.method === 'POST') {
            // Check if body exists (Vercel parses JSON automatically)
            const payload = req.body.altcha_payload || req.body; 
            const isValid = await verifySolution(payload, hmacKey);
            return res.status(200).json({ success: isValid });
        }
    } catch (err) {
        // This will print the actual error in your Vercel Logs
        console.error("ALTCHA Error:", err);
        return res.status(500).json({ error: err.message });
    }
}
