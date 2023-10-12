require('dotenv').config();

const OPEN_PROJECT_URL = 'http://10.10.10.79:8030/api/v3';

// status ids according to open project api
const TICKET_STATUS_IDS = {
  NEW: 1,
  IN_SPECIFICATION: 2,
  SPECIFIED: 3,
  CONFIRMED: 4,
  TO_BE_SCHEDULED: 5,
  SCHEDULED: 6,
  IN_PROGRESS: 7,
  DEVELOPED: 8,
  IN_TESTING: 9,
  TESTED: 10,
  TEST_FAILED: 11,
  CLOSED: 12,
  ON_HOLD: 13,
  REJECTED: 14,
  IN_REVIEW: 15,
  TO_DO: 16,
  DONE: 17,
};

const authHeader = `Basic ${Buffer.from(`apikey:${process.env.OPEN_PROJECT_API_KEY}`).toString(
  'base64'
)}`;

const headers = {
  headers: {
    Authorization: authHeader,
    'Content-Type': 'application/json',
  },
};

module.exports = {
  OPEN_PROJECT_URL,
  TICKET_STATUS_IDS,
  headers,
};
