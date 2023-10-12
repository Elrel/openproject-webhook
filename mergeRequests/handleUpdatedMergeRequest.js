const { updateStatus, TICKET_STATUS_IDS } = require('../api/updateStatus');
const { handleParentTaskStatus } = require('./handleParentTaskStatus');

/**
 * Handles the actions to be taken when an updated merge request is detected.
 *
 * @param {Object} mrData - The data of the updated merge request.
 * @param {Object} ticketData - The ticket data related to the merge request.
 */
async function handleUpdatedMergeRequest(mrData, ticketData) {
  console.log('> Detected Updated MR');
  const { IN_REVIEW, IN_PROGRESS } = TICKET_STATUS_IDS;
  const { mrTitle } = mrData;

  const statusToUpdate = !mrTitle.startsWith('Draft:') ? IN_REVIEW : IN_PROGRESS;
  await updateStatus(ticketData, statusToUpdate); // set the ticket's status to 'In Review / In Progress'

  await handleParentTaskStatus(ticketData); // check sibling tasks and update parent task accordingly
  console.log('-----------------------------------------------');
}

module.exports = {
  handleUpdatedMergeRequest,
};
