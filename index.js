const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const { handleMergeRequest } = require('./mergeRequests/handleMergeRequest');

const app = express();
const PORT = 8030;
const version = '0.0.1';

// Parse incoming JSON payloads
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send({
    version,
    projectName: 'open-project-webhook',
  });
});

// Handle incoming webhook requests
app.post('/', (req, res) => {
  const { object_kind, object_attributes, reviewers, assignees } = req.body;

  if (object_kind === 'merge_request' && object_attributes) {
    handleMergeRequest(object_attributes, reviewers, assignees);
  } else {
    // Respond to irrelevant webhook requests with an error status
    res.status(400).send('Unsupported webhook event/payload.');
    return;
  }

  // Respond to the webhook request with a success status
  res.status(200).send('Webhook received and processed successfully.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Environmental variable found: ${!!process.env.OPEN_PROJECT_API_KEY}`);
  console.log(`Webhook receiver listening on port ${PORT}.`);
});
