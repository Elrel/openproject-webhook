const axios = require('axios');
const { headers } = require('../api');
const { getTicketData, getCurrentDate, TICKET_STATUS_IDS } = require('../api');
const { getStatusKeyByValue, getAllDevTickets } = require('./utils');

/**
 * Checks if there is a QA task among the child tickets and updates the parent task status accordingly.
 *
 * @param {{href: string, title: string}[]} allChildren - An array of child ticket objects.
 * @param {string} parentURL - The URL of the parent task.
 * @returns {boolean} Returns true if a QA task is found and status is updated, otherwise returns false.
 */
async function getQATicket(allChildren, parentURL) {
  const qaChildTicket = allChildren.find((obj) => obj.title.startsWith('QA'));
  if (qaChildTicket) {
    const endingDigitsMatch = qaChildTicket.href.match(/\d+$/);
    const qaTicketId = `AC-${endingDigitsMatch[0]}`;
    console.log(' * QA Task found: ', qaTicketId);

    const {
      currentStatus: { id: statusId },
    } = await getTicketData(qaTicketId);
    const { REJECTED, IN_PROGRESS, IN_TESTING } = TICKET_STATUS_IDS;

    if (statusId === REJECTED) {
      // update parent task to IN PROGRESS (AC.2)
      await updateParentTaskStatus(parentURL, IN_PROGRESS, true, false);
      return true;
    }

    if (statusId === IN_PROGRESS) {
      // update parent task to IN TESTING (AC.5)
      await updateParentTaskStatus(parentURL, IN_TESTING);
      return true;
    }
  }
  console.log('No QA task found.');
  return false;
}

/**
 * Updates the status of the parent task to the specified status ID and optionally sets start and due dates.
 *
 * @param {string} url - The URL of the parent task.
 * @param {number} updateToStatusId - The ID of the status to update to.
 * @param {boolean} [startDate=false] - Whether to set the start date to the current date.
 * @param {boolean} [dueDate=false] - Whether to set the due date to the current date.
 */
async function updateParentTaskStatus(url, updateToStatusId, startDate = false, dueDate = false) {
  const {
    data: {
      lockVersion,
      _embedded: {
        type,
        status: { name: statusName, id: currentStatusId },
      },
    },
  } = await axios.get(url, headers);
  if (currentStatusId === updateToStatusId) console.log(` * ${type} is already ${statusName}`);
  else {
    const payload = {
      lockVersion: lockVersion,
      _links: {
        status: { href: `/api/v3/statuses/${updateToStatusId}` },
      },
    };

    if (startDate) payload.startDate = getCurrentDate();
    if (dueDate) payload.dueDate = getCurrentDate();

    await axios.patch(url, payload, headers);
    console.log(` * Parent Status updated: ${getStatusKeyByValue(updateToStatusId)}`);
  }
}

/**
 * Checks the statuses of all child development tasks and calls updateParentTaskStatus to update the parent task's status based on the results.
 *
 * @param {string[]} allDevTickets - An array of ticket IDs representing child development tasks.
 * @param {string} parentURL - The URL of the parent task.
 */
async function checkChildTasksStatus(allDevTickets, parentURL) {
  let allInReview = true;
  let allClosed = true;
  let inProgressTicket = null;
  const { IN_PROGRESS, IN_REVIEW, CLOSED, DEVELOPED } = TICKET_STATUS_IDS;

  for (const ticketId of allDevTickets) {
    // Call the API to get the ticket's status
    const {
      currentStatus: { id: statusId },
    } = await getTicketData(ticketId);

    if (statusId === IN_PROGRESS) {
      inProgressTicket = ticketId;
      allInReview = false;
      break; // Exit the loop if a ticket is In Progress
    } else if (statusId !== IN_REVIEW) {
      allInReview = false;
    } else if (statusId !== CLOSED) {
      allClosed = false;
    }
  }

  if (inProgressTicket) {
    console.log(' * Found ticket In Progress:', inProgressTicket);
    // update parent task to IN PROGRESS (AC.2)
    await updateParentTaskStatus(parentURL, IN_PROGRESS, true, false);
  }

  if (allInReview) {
    console.log(' * All child dev tasks are in review.');
    // update parent task to DEVELOPED (AC.4)
    await updateParentTaskStatus(parentURL, DEVELOPED);
  }

  if (allClosed) {
    console.log(' * All child dev tasks are closed.');
    // update parent task to TESTED (AC.6)
    await updateParentTaskStatus(parentURL, CLOSED, false, true);
  }
}

/**
 * Handles the status update of the parent task based on the status of child tasks or the QA ticket.
 *
 * @param {object} childTicketData - Data of the child ticket.
 * @param {object} childTicketData.parent - Parent ticket information containing ID and links.
 * @param {string} childTicketData.url - URL of the child ticket.
 */
async function handleParentTaskStatus(childTicketData) {
  const {
    parent: { id: parentTicketId, _links },
    url,
  } = childTicketData;

  // Construct the URL of the parent task
  const parentURL = url.replace('/activities', '').replace(/\d+$/, parentTicketId);

  // Check if there's a QA ticket and update parent task accordingly
  const updatedParentBasedOnQATask = await getQATicket(_links.children, parentURL);

  if (!updatedParentBasedOnQATask) {
    // Get all non-QA child tickets
    const allNonQAChildTickets = getAllDevTickets(_links.children);
    // Check and update parent task status based on child dev tasks
    await checkChildTasksStatus(allNonQAChildTickets, parentURL);
  }
}

module.exports = {
  handleParentTaskStatus,
};
