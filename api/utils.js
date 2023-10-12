/**
 * Determines the project ID based on the provided source project ID.
 *
 * @param {number} sourceProjectId - The source project ID.
 * @returns {number} The corresponding project ID or 0 if no mapping is found.
 */
function determineProjectId(sourceProjectId) {
  const projectMappings = {
    61: 5, // across-theme
    65: 5, // deno API
    158: 5, // openproject-webhook
  };
  return projectMappings[sourceProjectId] || 0;
}

/**
 * Extracts the ticket number from a source branch using the pattern 'AC-XXXX'.
 *
 * @param {string} sourceBranch - The source branch name.
 * @returns {string|null} The extracted ticket number or null if not found.
 */

function extractTicketNumberFromBranch(sourceBranch) {
  const regex = /AC-(\d{4})/;
  const match = sourceBranch.match(regex);
  return match ? match[1] : null;
}

/**
 * Retrieves the current date in the format 'YYYY-MM-DD'.
 *
 * @returns {string} The current date in 'YYYY-MM-DD' format.
 */
function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so we add 1 and pad with 0 if needed.
  const day = String(currentDate.getDate()).padStart(2, '0'); // Pad with 0 if the day is a single digit.

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

/**
 * Constructs a comment for a merge request based on the provided attributes, reviewers, and assignees.
 *
 * @param {Object} object_attributes - The object attributes of the merge request.
 * @param {string} object_attributes.state - The state of the merge request.
 * @param {string} object_attributes.created_at - The creation date of the merge request.
 * @param {string} object_attributes.title - The title of the merge request.
 * @param {string} object_attributes.url - The URL of the merge request.
 * @param {Array} reviewers - The array of reviewers for the merge request.
 * @param {Array} assignees - The array of assignees for the merge request.
 * @returns {string} The constructed comment in formatted Markdown.
 */
function constructComment(object_attributes, reviewers, assignees) {
  const { state, created_at: mrCreatedAt, title: mrTitle, url } = object_attributes;

  let comment = [
    `Detected Merge Request is: **${state}** \n[${url}]`,
    `\`\`\`text\nMerge Request Title - [${mrTitle}]\n`,
    `Date Created - [${mrCreatedAt}]\n`,
  ];

  if (assignees && assignees.length > 0) {
    const assigneeNames = assignees.map(({ name }) => name).join(', ');
    comment.push(`Assignees - [${assigneeNames}]\n`);
  }

  if (reviewers && reviewers.length > 0) {
    const reviewerNames = reviewers.map(({ name }) => name).join(', ');
    comment.push(`Reviewers - [${reviewerNames}]\n`);
  }

  const mergedComment = comment.join('\n');
  const formattedComment = `${mergedComment}\`\`\``;
  return formattedComment;
}

/**
 * Retrieves the task type ID based on the provided type and status ID.
 *
 * @param {string} type - The type of the task.
 * @param {number} statusId - The ID of the status of the task.
 * @returns {number} The task type ID based on the provided type and status ID.
 */
function getTaskTypeId(type, statusId) {
  switch (type) {
    case 'Task':
      return statusId;
    default:
      return 0;
  }
}

module.exports = {
  extractTicketNumberFromBranch,
  getTaskTypeId,
  getCurrentDate,
  constructComment,
  determineProjectId,
};
