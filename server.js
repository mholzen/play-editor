const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 3000;

// Proxy middleware for /api requests
app.use('/api', createProxyMiddleware({
    target: 'http://host.docker.internal:1300',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/api', // keep /api prefix when forwarding
    },
}));

// Serve static files from the React build
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
}); 