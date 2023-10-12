const axios = require('axios');
const { OPEN_PROJECT_URL, headers } = require('./constants');
const InvalidBranchNameError = require('./customError');
const { extractTicketNumberFromBranch } = require('./utils');

/**
 * Retrieves ticket data based on the provided source branch.
 *
 * @param {string} sourceBranch - The source branch name to extract the ticket number.
 * @returns {Object} An object containing ticket-related data including lock version, parent, URL, ID, type name, and current status.
 * @throws {InvalidBranchNameError} When an invalid branch naming is encountered.
 */
async function getTicketData(sourceBranch) {
  try {
    const workPackageId = extractTicketNumberFromBranch(sourceBranch);

    if (workPackageId === null)
      throw new InvalidBranchNameError(`Invalid branch naming: ${sourceBranch}`);

    const url = `${OPEN_PROJECT_URL}/work_packages/${workPackageId}/activities`;

    const {
      data: {
        lockVersion,
        _embedded: { parent, type, status },
        id,
      },
    } = await axios.get(url, headers);
    return {
      lockVersion,
      parent,
      url,
      id,
      type: type.name,
      currentStatus: status,
    };
  } catch (error) {
    console.error('Error fetching ticket related data:', JSON.stringify(error.message));
  }
}

module.exports = {
  getTicketData,
};
