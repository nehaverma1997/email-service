const { Client } = require('@elastic/elasticsearch');
const { ELASTICSEARCH_HOST, ELASTICSEARCH_USERNAME, ELASTICSEARCH_PASSWORD, ELASTICSEARCH_CLOUD_ID } = require('../util/config');

const elasticClient = new Client({
    cloud: {
        id: ELASTICSEARCH_CLOUD_ID
    },
    auth: {
        username: ELASTICSEARCH_USERNAME,
        password: ELASTICSEARCH_PASSWORD
    }
})

const definedIndexs = {
    email: 'email_data'
}


// Check the connection and create indices on success
async function checkConnection() {
    try {
        const result = await elasticClient.ping();
        console.log('Elasticsearch connection successful', result);
        if (result) await createIndices();
    } catch (error) {
        console.error('Elasticsearch connection failed:', error);
    }
}

checkConnection();

async function createIndices() {
    try {
        const { body: exists } = await elasticClient.indices.exists({ index: definedIndexs.email });

        if (exists) {
            console.log('Index already exists');
            return;
        }

        const { body } = await elasticClient.indices.create({
            index: definedIndexs.email,
            body: {
                mappings: {
                    properties: {
                        email_type: { type: 'text' },
                        email_id: { type: 'text' },
                        threadId: { type: 'text' },
                        labelIds: { type: 'keyword' },
                        snippet: { type: 'text' },
                        historyId: { type: 'text' },
                        sizeEstimate: { type: 'integer' },
                        internalDate: { type: 'text' },
                        entire_email_data: { type: 'object' },
                        date: { type: 'date' }
                    }
                }
            }
        });

        console.log('Index creation response:', body);

    } catch (error) {
        if (error.meta?.body?.error?.type === 'resource_already_exists_exception') console.log('Index already exists');
        else console.log('Error while craeting indices:', error);
    }
}

module.exports = { elasticClient, definedIndexs };
