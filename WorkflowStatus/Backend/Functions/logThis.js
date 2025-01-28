const fs = require('fs')

const logThis = (filePath,loggedData) =>{
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return;
        }
        
        let logs = JSON.parse(data);
        logs.requests.push(loggedData);

        fs.writeFile(filePath, JSON.stringify(logs, null, 2), (err) => {
            if (err) {
                console.error("Error writing file:", err);
                return;
            }
            console.log('Request logged successfully.');
        });
    });
}

module.exports ={
    logThis
}
