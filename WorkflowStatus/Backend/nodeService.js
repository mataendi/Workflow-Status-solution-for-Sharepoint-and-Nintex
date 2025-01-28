const Service = require('node-windows').Service

const svc = new Service({
    name:"Sharepoint Web Services",
    description: "This runs the node.js server for Sharepoint Services",
    script: "./server.js"
})

svc.on('install',function(){
    svc.start()
})

svc.install()