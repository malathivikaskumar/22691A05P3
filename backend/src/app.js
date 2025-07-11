const express = require('express');
const cors = require('cors');
const shortid = require('shortid');
const axios = require('axios');
const loggingMiddleware = require('../../middleware/loggingMiddleware');

const app = express();
app.use(cors());
app.use(express.json());
app.use(loggingMiddleware);


const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


const urls = {};
app.post('/shorturls', (req, res) => {
    const { url, validity = 30, shortcode } = req.body;
    console.log(url);
    if (!url) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    const code = shortcode || shortid.generate();
    if (urls[code]) {
        return res.status(409).json({ error: 'Shortcode already exists' });
    }

    const now = new Date();
    const expiry = new Date(now.getTime() + validity * 60000);

    urls[code] = {
        url,
        createdAt: now.toISOString(),
        expiry: expiry.toISOString(),
        clicks: []
    };

    res.status(200).json({
        shortLink: `http://localhost:${PORT}/${code}`,
        expiry: expiry.toISOString()
    });
});


app.get('/shorturls/:code', (req, res) => {
    const code = req.params.code;
    const data = urls[code];

    if (!data) {
        return res.status(404).json({ error: 'Shortcode not found' });
    }

    const now = new Date();
    const expiry = new Date(data.expiry);
    if (now > expiry) {
        return res.status(410).json({ error: 'Link expired' });
    }

    res.json({
        url: data.url,
        createdAt: data.createdAt,
        expiry: data.expiry,
        clickCount: data.clicks.length,
        clicks: data.clicks
    });
});

// Redirect to long URL
app.get('/:code', (req, res) => {
    const code = req.params.code;
    const data = urls[code];

    if (!data) {
        return res.status(404).send('Shortcode not found');
    }

    const now = new Date();
    const expiry = new Date(data.expiry);
    if (now > expiry) {
        return res.status(410).send('Link expired');
    }

    const clickInfo = {
        timestamp: now.toISOString(),
        referrer: req.get('Referrer') || 'unknown'
    };

    data.clicks.push(clickInfo);
    res.redirect(data.url);
});

