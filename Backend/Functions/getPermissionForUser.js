const axios = require('axios');

const GetPermissionForUser = async (site, listName, itemId, userID, userFullName, listId, username, password) => {
    const sp_site = process.env.sharepointURL
    const siteUrl = sp_site;
    const endpoint = `${siteUrl}/_api/web/lists/getbyid('${listId}')/items(${itemId})/roleassignments`;


    const domain = process.env.domain

    username = domain + username

    const auth = { username, password };


    async function fetchGroupMembers(groupId) {
        try {
            const response = await axios.get(`${siteUrl}/_api/Web/SiteGroups(${groupId})/users`, { auth });
            return response.data.value.map(user => ({ name: user.Title, permission: 'Group Member' }));
        } catch (error) {
/*             console.error("Error fetching group members:", error.message); */
            return [];
        }
    }

    try {
 
        const response = await axios.get(endpoint, { auth });

        if (response.status === 200 && response.data && response.data.value) {
            const permissions = [];
            for (const assignment of response.data.value) {
                const principalId = assignment.PrincipalId;
                let role;

                try {
                    const roleResponse = await axios.get(`${siteUrl}/_api/web/lists/getbyid('${listId}')/items(${itemId})/roleassignments/getbyprincipalid(${principalId})/RoleDefinitionBindings`, { auth });

        

                    if (roleResponse.data && roleResponse.data.value && roleResponse.data.value.length > 0) {
                        role = roleResponse.data.value[0].Name;
                    }

                    const groupMembersResponse = await fetchGroupMembers(principalId);
                    permissions.push(...groupMembersResponse);
                    permissions.push({ name: principalId, permission: role || 'undefined' });
                } catch (error) {
                    console.error("Error processing role assignment:", error.message);
                    permissions.push({ name: principalId, permission: 'undefined' });
                }
            }

     

            return checkIfUserHasPermission(permissions, userID, userFullName);
        } else {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
   
        return false;
    }
};

const checkIfUserHasPermission = (array, id, name) => {
 
    for (let i = 0; i < array.length; i++) {
        if (array[i].name === id || array[i].name === name) {
            return true;
        }
    }

    return false;
};

module.exports = {
    GetPermissionForUser
};
