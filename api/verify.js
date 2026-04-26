// This runs on Vercel/Netlify for free
const { verifySolution } = require('altcha-lib');

export default async function handler(req, res) {
    // 1. Get the payload from the form
    const { altcha_payload } = req.body;
    
    // 2. Verify it using your secret key
    const isValid = await verifySolution(altcha_payload, process.env.ALTCHA_SECRET);

    if (isValid) {
        return res.status(200).json({ success: true, message: "Human verified!" });
    } else {
        return res.status(400).json({ success: false, message: "Bot detected!" });
    }
}
