const bodyParser = require('body-parser')
const Mailchimp = require('mailchimp-api-v3');
const express = require('express');
const cors = require('cors');
const md5 = require('md5');
const functions = require('firebase-functions')

// Subscribe the user to a MailChimp mailing list

module.exports.resourceSubscribe = () => {
  const app = express();
  const listId = '83c92c33a4';
  // Automatically allow cross-origin requests
  app.use(cors({ origin: true }));
  app.post('/', (req, res) => {

    let body = {
      "email_address": req.body.emailAddress,
      "status": "subscribed"
    }

    mailchimp.post('/lists/' + listId + '/members', body)
      .then((result) => {
        res.status(200).send(result);
        res.end();
      }).catch((errors) => {
        res.status(500).send(errors);
        res.end();
      })
  });

  return app;
}

// Executing the resourceSubscribe function via Firebase Functions
exports.resource_subscribe = functions.https.onRequest(api.resourceSubscribe());
