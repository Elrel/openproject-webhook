const { determineProjectId, getTicketData } = require('../api');
const { handleOpenMergeRequest } = require('./handleOpenMergeRequest');
const { handleUpdatedMergeRequest } = require('./handleUpdatedMergeRequest');
const { handleClosedMergeRequest } = require('./handleClosedMergeRequest');

/**
 * Handles various actions based on merge request events.
 *
 * @param {Object} object_attributes - The attributes of the merge request.
 * @param {Array} reviewers - The list of reviewers for the merge request.
 * @param {Array} assignees - The list of assignees for the merge request.
 */
async function handleMergeRequest(object_attributes, reviewers, assignees) {
  const {
    state: mr_state,
    source_branch,
    source_project_id,
    action,
    title: mrTitle,
  } = object_attributes;

  const isProjectValid = !!determineProjectId(source_project_id);
  const protectedBranches = ['dev', 'master', 'production'];
  const isProtectedBranch = protectedBranches.includes(source_branch);

  if (isProjectValid && !isProtectedBranch) {
    console.log('-----------------------------------------------');
    console.log('Branch: ', source_branch);
    const ticketData = await getTicketData(source_branch);

    if (mr_state === 'opened') {
      if (action === 'open') {
        const mrData = { object_attributes, reviewers, assignees };
        await handleOpenMergeRequest(mrData, ticketData);
      } else if (action === 'update') {
        const mrData = { mrTitle };
        await handleUpdatedMergeRequest(mrData, ticketData);
      }
    }

    if (mr_state === 'merged') {
      const mrData = { object_attributes, reviewers, assignees };
      await handleClosedMergeRequest(mrData, ticketData);
    }
  }
}

module.exports = {
  handleMergeRequest,
};
