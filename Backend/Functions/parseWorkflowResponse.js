const xml2js = require('xml2js');

const { calculateDayDifference } = require('./dateFunctions')
const { getUsersOfGroup } = require('./getUsersOfGroups')



async function parseWorkflowResponse(response, site,spUserName,spPassword) {
    const parser = new xml2js.Parser();
    let workflowData = [];

    try {
        const result = await parser.parseStringPromise(response);
        const workflowLog = result?.['soap:Envelope']?.['soap:Body']?.[0]?.GetWorkflowHistoryForListItemResponse?.[0]?.GetWorkflowHistoryForListItemResult?.[0]?.WorkflowLog?.[0];


        if (workflowLog) {
            const humanTasks = workflowLog?.HumanTasks?.[0]?.HumanTaskLogInfo;

            if (humanTasks && humanTasks.length > 0) {
                workflowData = await Promise.all(
                    humanTasks
                        .filter(task => task.Outcome[0] === 'Pending')
                        .map(async task => {
                            let displayName = await getUsersOfGroup(site, task.DisplayName[0], spUserName, spPassword);
                            if (!displayName) {
                                displayName = task.DisplayName[0];
                            }
                            return {
                                displayName,
                                outcome: task.Outcome[0],
                                idle: calculateDayDifference(task.UserStart), //this shows it in days, format it on the front end
                                startDate: String(task.UserStart).split("T")[0]
                            };
                        })
                );
            }
        }
    } catch (err) {
        console.error('Error parsing workflow response:', err.message);
    }

    return workflowData;
}

module.exports = {
    parseWorkflowResponse
}