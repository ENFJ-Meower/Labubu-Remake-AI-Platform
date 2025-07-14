const express = require('express');
const jwt = require('jsonwebtoken');
const { createProxyMiddleware } = require('http-proxy-middleware');
const NodeCache = require('node-cache');

const app = express();
const tokenCache = new NodeCache({ stdTTL: 300 });

const defaultNoAuthPaths = [
    '/user',
    '/healthz'
];

const noAuthPaths = process.env.NO_AUTH_PATHS
    ? process.env.NO_AUTH_PATHS.split(',')
    : defaultNoAuthPaths;

console.log(`No-auth paths: ${noAuthPaths.join(', ')}`);

app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
});

app.use((req, res, next) => {
    const path = req.path;

    if (noAuthPaths.some(p => path.startsWith(p))) {
        return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing authorization token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        let decoded = tokenCache.get(token);
        if (!decoded) {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            tokenCache.set(token, decoded);
        }

        req.headers['X-User-Id'] = decoded.user_id;
        req.headers['X-Username'] = decoded.username;
        req.headers['X-Email'] = decoded.email;

        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
});

let router;
try {
    const proxyRoutes = process.env.PROXY_ROUTES;
    router = JSON.parse(proxyRoutes);
} catch (err) {
    console.error('Failed to parse PROXY_ROUTES:', err.message);
    process.exit(1);
}

const proxyOptions = {
    changeOrigin: true,
    router: router,
    onProxyReq: (proxyReq, req) => {
        if (req.headers['X-User-Id']) {
            proxyReq.setHeader('X-User-Id', req.headers['X-User-Id']);
        }
        if (req.headers['X-Username']) {
            proxyReq.setHeader('X-Username', req.headers['X-Username']);
        }
        if (req.headers['X-Email']) {
            proxyReq.setHeader('X-Email', req.headers['X-Email']);
        }
    }
};

app.use(createProxyMiddleware(proxyOptions));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Auth gateway running on port ${PORT}`);
});