module.exports = function (app) {
    const passport = require('passport');
    const controller = require('../controller/email');

    //Currently not working
    app.get('/auth/outlook', passport.authenticate('windowslive', {
        scope: ['openid', 'profile', 'offline_access', 'https://outlook.office.com/mail.read']
    }));


    //Currently not working
    app.get('/auth/outlook/callback', passport.authenticate('windowslive', {
        failureRedirect: '/'
    }), (req, res) => {
        // Save user details and access token to the database
        const user = req.user;
        // TODO: Save user to Elasticsearch
        res.redirect('/outlook/sync');
    });

    //Currently not working
    app.get('/outlook/sync', async (req, res) => {
        if (!req.isAuthenticated()) return res.redirect('/auth/outlook');
        // Synchronize emails
        await controller.outlookSyncEmails(req.user.accessToken);
        res.send('Synchronization started.');
    });


    app.get('/auth/google', passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/gmail.readonly']
    }));


    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/'
    }), (req, res) => {
        // Save user details and access token to the database
        const user = req.user;
        // TODO: Save user to Elasticsearch
        res.redirect('/google/sync');
    });


    app.get('/google/sync', async (req, res) => {
        try {
            if (!req.isAuthenticated()) return res.redirect('/auth/google');
            // Synchronize emails
            const resp = await controller.googleSyncEmails(req.user.accessToken);
            console.log("API -RESP ", resp)
            res.redirect('/sync-success.html?email_type=gmail');
        } catch (error) {
            console.error("Error synchronizing google email emails:", error);
            res.redirect('/sync-error.html');
        }
    });


    app.get('/gmail/emails', async (req, res) => {
        try {
            console.log("---> I got the call")
            const queryData = req.query;
            console.log("---> queryData", queryData);
            const response = await controller.fetchEmails(queryData);
            // console.log("---> reasponse", response);
            res.send({
                "status": "success",
                "code": 200,
                "data": {
                    "totalHits": response.totalHits,
                    "emails": response.hits
                }
            });

        } catch (error) {
            console.error('Error fetching emails:', error);
            res.status(500).json({ error: 'Error fetching emails' });
        }
    });
}