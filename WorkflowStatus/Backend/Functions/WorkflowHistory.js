
const { formatDate } = require('./functions/dateFunctions')
const { logThis } = require("./functions/logThis")
const { getStatus } = require("./functions/getStatus")
const { parseWorkflowResponse } = require('./functions/parseWorkflowResponse')



const axios = require('axios');

const logPath = "./logs/logs.json"

const sp_site = process.env.sharepointURL
const domain = process.env.domain

let request;

const handleSoap = async (req, res, spUserName, spPassword) => {
    const { site, itemId, listName, userID, userFullName, listID } = req.body;
    try {


       
        
        let logDate = new Date();


     const isFaulting = await getStatus(site, itemId, listID, spUserName, spPassword);
        
   

        const stateFilter = 'Running';
        const workflowNameFilter = '';

        const soapRequest = `
            <soapenv:Envelope xmlns:soapenv='http://www.w3.org/2003/05/soap-envelope' 
                xmlns:nin='http://nintex.com'>
                <soapenv:Header/>
                <soapenv:Body>
                    <nin:GetWorkflowHistoryForListItem>
                        <nin:itemId>${itemId}</nin:itemId>
                        <nin:listName>${listID}</nin:listName>
                        <nin:stateFilter>${stateFilter}</nin:stateFilter>
                        <nin:workflowNameFilter>${workflowNameFilter}</nin:workflowNameFilter>
                    </nin:GetWorkflowHistoryForListItem>
                </soapenv:Body>
            </soapenv:Envelope>`;

        const authHeader = `Basic ${Buffer.from(`${domain}\\${spUserName}:${spPassword}`).toString('base64')}`;

        const response = await axios.post(`${sp_site}/${site}/_vti_bin/NintexWorkflow/Workflow.asmx`, soapRequest, {
            headers: {
                'Content-Type': 'text/xml;charset=utf-8',
                'SOAPAction': 'http://nintex.com/GetWorkflowHistoryForListItem',
                'Authorization': authHeader,
            },
        });

        const xmlResponse = response.data;
        const workflowData = await parseWorkflowResponse(xmlResponse, site,spUserName,spPassword);

        if(Object.keys(workflowData).length < 1){
            if (isFaulting) {
                request = {
                    caller: userFullName,
                    site: site,
                    listID: listID,
                    itemId: itemId,
                    list: listName,
                    date: formatDate(logDate),
                    hasPermission: true,
                    sentData: workflowData
                }
        
                logThis(logPath,request)
                return res.status(401).json({ error: "The workflow on this item has run into an error." });
            } 
        }
       
        res.json({ workflowData });




        request = {
            caller: userFullName,
            site: site,
            listID: listID,
            itemId: itemId,
            list: listName,
            date: formatDate(logDate),
            hasPermission: true,
            sentData: workflowData
        }

        logThis(logPath,request)


    } catch (error) {

        console.log(error)

        let logDate = new Date();

        let request = {
            caller: userFullName,
            site: site,
            listID: listID,
            itemId: itemId,
            list: listName,
            date: formatDate(logDate),
            hasPermission: true,
            sentData: error.message
        }

        logThis(logPath,request)

        console.error('Error fetching workflow history:', error.message);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

module.exports ={
    handleSoap
}