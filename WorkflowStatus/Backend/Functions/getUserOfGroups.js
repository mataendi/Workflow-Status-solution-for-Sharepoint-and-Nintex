const axios = require('axios');

async function getUsersOfGroup(site, groupName, spUserName, spPassword) {

    const sp_site = process.env.sharepointURL
    const domain = process.env.domain

    try {
        const siteUrl = `${sp_site}/${site}`;

        const authHeader = `Basic ${Buffer.from(`${domain }\\${spUserName}:${spPassword}`).toString('base64')}`;

      const response = await axios.get(`${siteUrl}/_api/Web/SiteGroups/GetByName('${groupName}')/users`, {
        headers: {
            "Accept": "application/json;odata=verbose",
            "Authorization": authHeader
        }
    });

    const users = response.data.d.results.map(user => {
        return {
            Title: user.Title
        };
    });
        // Check if the group has any users
        if (users.length > 0) {
            // Return the list of users
            return users;
        } else {
            // Return false to indicate that it's not a group
            return false;
        }
    } catch (error) {
        // If an error occurs, assume it's not a group

        return false;
    }}

module.exports = {
    getUsersOfGroup
}