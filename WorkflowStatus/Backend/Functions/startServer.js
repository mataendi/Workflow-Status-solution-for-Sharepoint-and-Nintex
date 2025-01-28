const https = require('https');

const port = 443;


const { getCerts } = require('./certs.js');

async function startServer(app) {
    try {

        const httpsOptions = await getCerts();
        const httpsServer = https.createServer(httpsOptions, app);

        httpsServer.listen(port, () => {
            console.log(`Server is running at https://server:${port}`);
        });
    } catch (error) {
        console.error('Error setting up HTTPS server:', error);
    }
}

module.exports = {
    startServer
}