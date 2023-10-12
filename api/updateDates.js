require('dotenv').config();
const axios = require('axios');
const { getCurrentDate } = require('./utils');
const { headers } = require('./constants');

/**
 * Updates the start or end date of a specific ticket in OpenProject.
 *
 * @param {Object} ticketData - The ticket data containing the URL and lockVersion of the ticket.
 * @param {boolean} isStartDate - Indicates whether to update the start date (true) or end date (false).
 */
async function updateDates(ticketData, isStartDate) {
  try {
    const { url, lockVersion } = ticketData;
    const newURL = url.replace('/activities', '');
    const payload = { lockVersion };

    if (isStartDate) payload.startDate = getCurrentDate();
    else payload.dueDate = getCurrentDate();

    await axios.patch(newURL, payload, headers);
    console.log(` - ${isStartDate ? 'Start' : 'End'} Date updated`);
  } catch (error) {
    console.error('Error updating start/end dates in OpenProject:', JSON.stringify(error));
  }
}

module.exports = {
  updateDates,
};
