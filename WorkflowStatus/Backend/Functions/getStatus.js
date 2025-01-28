const axios = require('axios');
const xml2js = require('xml2js');

async function getStatus(site, itemId, listID, spUserName, spPassword) {
    try {
        const stateFilter = 'Faulting'; /*Running, Completed, Faulting*/
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


        const domain = process.env.domain
        const authHeader = `Basic ${Buffer.from(`${domain}\\${spUserName}:${spPassword}`).toString('base64')}`;



        const sp_site = process.env.sharepointURL

        const response = await axios.post(`${sp_site}/${site}/_vti_bin/NintexWorkflow/Workflow.asmx`, soapRequest, {
            headers: {
                'Content-Type': 'text/xml;charset=utf-8',
                'SOAPAction': 'http://nintex.com/GetWorkflowHistoryForListItem',
                'Authorization': authHeader,
            },
        });

        const xmlResponse = response.data;
        const workflowData = await parseWorkflowResponse(xmlResponse);

        // Check if workflowData is empty
        return Object.keys(workflowData).length > 0;
    } catch (error) {
        console.error('Error fetching workflow history:', error.message);
        throw new Error('Internal Server Error');
    }
}


async function parseWorkflowResponse(response) {
    const parser = new xml2js.Parser();
    let workflowData = [];

    try {
        const result = await parser.parseStringPromise(response);
        const workflowLog = result?.['soap:Envelope']?.['soap:Body']?.[0]?.GetWorkflowHistoryForListItemResponse?.[0]?.GetWorkflowHistoryForListItemResult?.[0]?.WorkflowLog?.[0];

        if (workflowLog) {
            workflowData = workflowLog;
        }
    } catch (err) {
        console.error('Error parsing workflow response:', err.message);
    }

    return workflowData;
}

module.exports = {
    getStatus
};

