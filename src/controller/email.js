const axios = require('axios');
const { google } = require('googleapis');
const db = require('../db/db-services');

const outlookSyncEmails = async (accessToken) => {
    try {
        const response = await axios.get('https://graph.microsoft.com/v1.0/me/messages', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const emails = response.data.value;

        // Index emails to Elasticsearch
        emails.forEach(async email => {
            // await elasticClient.index({
            //     index: 'emails',
            //     body: {
            //         ...email, // Include the original email data
            //         source: 'outlook' // Add an additional key to indicate the source
            //     }
            // });
        });
    } catch (error) {
        console.error('Error synchronizing emails:', error);
    }
};

const googleSyncEmails = async (accessToken, userId) => {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    try {
        const res = await gmail.users.messages.list({ userId: 'me', maxResults: 100 });
        const messages = res.data.messages;

        if (!messages || messages.length === 0) return;

        console.log("---> messages", messages.length)


        for (const message of messages) {
            // console.log("message", message);
            const msg = await gmail.users.messages.get({ userId: 'me', id: message.id });
            // console.log("msg", msg.data);
            const dataToInsert = {
                email_type: 'gmail',
                email_id: msg.data.id,
                threadId: msg.data.threadId,
                labelIds: msg.data.labelIds,
                snippet: msg.data.snippet,
                historyId: msg.data.historyId,
                sizeEstimate: msg.data.sizeEstimate,
                internalDate: msg.data.internalDate,
                entire_email_data: msg.data,
                date: new Date(),
            }
            // console.log("dataToInsert", dataToInsert);
            await db.insertData(dataToInsert);
        }
        return true;
    } catch (error) {
        console.error('Error synchronizing emails:', error);
        throw Error(error)
    }
};

const fetchEmails = async (queryData) =>{
    try{

        const dbResult = await db.fetchData(100, 1, queryData.email_type);
        // console.log("---> dbResult", dbResult);

        return dbResult;

    } catch(error){
        console.error('Error while fetching emails:', error);
        throw Error(error)
    }
}

module.exports = { outlookSyncEmails, googleSyncEmails, fetchEmails };
