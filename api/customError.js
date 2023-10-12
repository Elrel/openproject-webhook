class InvalidBranchNameError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidBranchNameError';
  }
}

module.exports = InvalidBranchNameError;
