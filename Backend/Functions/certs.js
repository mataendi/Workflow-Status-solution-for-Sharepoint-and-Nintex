const fs = require('fs');

const certPath = './certs/server.cer'
const keyPath = './certs/server.key'

const getCerts = async () => {
    try {
        const httpsOptions = {
            cert: fs.readFileSync(certPath), 
            key: fs.readFileSync(keyPath),
        };


        return httpsOptions;
    } catch (error) {
        console.error('Error reading certificate or key files:', error);
        throw error; 
    }
};

module.exports = {
    getCerts
};
