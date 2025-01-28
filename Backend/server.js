const express = require('express');
const cors = require('cors');

const {startServer} = require('./Functions/startServer.js')



const WorkflowHistory = require('./Functions/WorkflowHistory/WorkflowHistory.js');

require('dotenv').config({ path: './data.env' });

const spUserName = process.env.spUserName;
const spPassword = process.env.spPassword;
const sp_site = process.env.sharepointURL


const app = express();


app.use(cors({
    origin: sp_site,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');


app.post('/getWorkflowHistory', async (req, res) => {
    WorkflowHistory.handleSoap(req, res, spUserName, spPassword);
});



startServer(app);
