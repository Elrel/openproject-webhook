const {
  postComment,
  updateStatus,
  updateDates,
  constructComment,
  TICKET_STATUS_IDS,
} = require('../api');
const { handleParentTaskStatus } = require('./handleParentTaskStatus');

/**
 * Handles the actions to be taken when a merged merge request is detected.
 *
 * @param {Object} mrData - The data of the merged merge request.
 * @param {Object} ticketData - The ticket data related to the merge request.
 */
async function handleClosedMergeRequest(mrData, ticketData) {
  console.log('> Detected Merged MR');
  const { CLOSED } = TICKET_STATUS_IDS;
  const { object_attributes, reviewers, assignees } = mrData;

  const comment = constructComment(object_attributes, reviewers, assignees); // generate relevant comment
  await postComment(ticketData, comment); // post comment about merged MR
  await updateStatus(ticketData, CLOSED); // set the ticket's status to 'Closed'
  await updateDates(ticketData, false); // set end date

  await handleParentTaskStatus(ticketData); // check sibling tasks and update parent task accordingly
  console.log('-----------------------------------------------');
}

module.exports = {
  handleClosedMergeRequest,
};
