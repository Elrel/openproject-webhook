const {
  postComment,
  updateStatus,
  updateDates,
  constructComment,
  TICKET_STATUS_IDS,
} = require('../api');
const { handleParentTaskStatus } = require('./handleParentTaskStatus');

/**
 * Handles the actions to be taken when a new merge request is detected.
 *
 * @param {Object} mrData - The data of the new merge request.
 * @param {Object} ticketData - The ticket data related to the merge request.
 */
async function handleOpenMergeRequest(mrData, ticketData) {
  console.log('> Detected New MR');
  const { IN_PROGRESS } = TICKET_STATUS_IDS;
  const { object_attributes, reviewers, assignees } = mrData;

  const comment = constructComment(object_attributes, reviewers, assignees); // generate relevant comment
  await postComment(ticketData, comment); // post comment about creating an new MR
  await updateStatus(ticketData, IN_PROGRESS); // set the ticket's status to 'In Progress'
  await updateDates(ticketData, true); // set starting date

  await handleParentTaskStatus(ticketData); // check sibling tasks and update parent task accordingly
  console.log('-----------------------------------------------');
}

module.exports = {
  handleOpenMergeRequest,
};
