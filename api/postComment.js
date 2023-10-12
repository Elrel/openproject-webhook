const axios = require('axios');
require('dotenv').config();
const { headers } = require('./constants');

/**
 * Posts a custom comment to a specific ticket in OpenProject.
 *
 * @param {Object} ticketData - The ticket data containing the URL of the ticket.
 * @param {string} customComment - The custom comment to be posted.
 */
async function postComment(ticketData, customComment) {
  try {
    const { url } = ticketData;
    const payload = {
      comment: {
        format: 'markdown',
        raw: customComment,
      },
    };

    await axios.post(url, payload, headers);
    console.log(' - Comment posted');
  } catch (error) {
    console.error('Error creating comment in OpenProject:', JSON.stringify(error.message));
  }
}

module.exports = {
  postComment,
};
