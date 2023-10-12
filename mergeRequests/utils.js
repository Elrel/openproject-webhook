const { TICKET_STATUS_IDS } = require('../api');

/**
 * Retrieves the key corresponding to a given value in the TICKET_STATUS_IDS object.
 *
 * @param {number} value - The value for which the corresponding key is to be found.
 * @returns {string|null} The key corresponding to the provided value, or null if not found.
 */
function getStatusKeyByValue(value) {
  for (const key in TICKET_STATUS_IDS) {
    if (TICKET_STATUS_IDS[key] === value) return key;
  }
  return null;
}

/**
 * Retrieves an array of development-related ticket IDs from an array of child ticket objects.
 *
 * @param {{href: string, title: string}[]} allChildren - Array of child ticket objects.
 * @returns {string[]} Array of development-related ticket IDs in the format "AC-<digits>".
 */
function getAllDevTickets(allChildren) {
  return allChildren
    .filter((obj) => !obj.title.startsWith('QA'))
    .map(({ href }) => {
      const endingDigitsMatch = href.match(/\d+$/);
      return `AC-${endingDigitsMatch[0]}`;
    });
}

module.exports = {
  getStatusKeyByValue,
  getAllDevTickets,
};
