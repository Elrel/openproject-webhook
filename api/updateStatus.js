const axios = require('axios');
require('dotenv').config();
const { getTaskTypeId } = require('./utils');
const { headers } = require('./constants');

/**
 * Updates the status of a specific ticket in OpenProject.
 *
 * @param {Object} ticketData - The ticket data containing the necessary information for the update.
 * @param {number} updateToStatusId - The ID of the status to update to.
 */
async function updateStatus(ticketData, updateToStatusId) {
  try {
    const {
      lockVersion,
      type,
      url,
      currentStatus: { name: statusName, id: currentStatusId },
    } = ticketData;
    const newURL = url.replace('/activities', '');
    const correctIdForType = getTaskTypeId(type, updateToStatusId);

    if (currentStatusId === updateToStatusId) console.log(` - ${type} is already ${statusName}`);

    if (correctIdForType && currentStatusId !== updateToStatusId) {
      const payload = {
        lockVersion: lockVersion,
        _links: {
          status: { href: `/api/v3/statuses/${correctIdForType}` },
        },
      };

      await axios.patch(newURL, payload, headers);
      console.log(' - Status updated');
    } else {
      console.log(`   - Status not updated for ${type}`);
    }
  } catch (error) {
    console.error('Error updating ticket status in OpenProject:', JSON.stringify(error));
  }
}

module.exports = {
  updateStatus,
};
