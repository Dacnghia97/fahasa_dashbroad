export default async function handler(req, res) {
    // Handling CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Fetch variables from Vercel Environment Variables
        const nocodbUrl = process.env.NOCODB_API_URL;
        const nocodbToken = process.env.NOCODB_API_TOKEN;

        if (!nocodbUrl || !nocodbToken) {
            return res.status(500).json({ error: 'Server Configuration Error: Missing API Credentials' });
        }

        const response = await fetch(nocodbUrl, {
            headers: { 'xc-token': nocodbToken }
        });

        if (!response.ok) {
            throw new Error(`NocoDB returned ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("API Proxy Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
