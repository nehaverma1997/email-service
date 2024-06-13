const { elasticClient, definedIndexs } = require('../db/database');

async function insertData(dataToInsert) {
    try {
        console.log("dataToInsert", dataToInsert);
        const insert_resp = await elasticClient.index({
            index: definedIndexs.email,
            body: dataToInsert,
        });

        // console.log('Document inserted:', insert_resp);

        return true;

    } catch (error) {
        console.log("-------> Error while inserting data", error)
        throw Error('Error while inserting data')
    }
}

async function fetchData(pageSize, pageNumber, email_type) {
    try {
        // const pageSize = 10;
        // const pageNumber = 1;

        const from = (pageNumber - 1) * pageSize;

        let documentToSearch = {
            index: definedIndexs.email,
            from: from,
            size: pageSize, // Number of results to return in each page
            body: {
                query: {
                    match_all: {} // Retrieves all documents in the index
                }
            }
        }

        if (email_type) {
            documentToSearch.body = {
                query: {
                    term: { email_type: email_type }
                }
            }
        }

        // console.log("---> documentToSearch", documentToSearch);

        const response = await elasticClient.search(documentToSearch);
        const totalHits = response.hits.total.value;
        const hits = response.hits.hits;

        return { totalHits, hits };

    } catch (error) {
        console.log("-------> Error while inserting data", error)
        throw Error('Error while inserting data')
    }
}

module.exports = { insertData, fetchData };