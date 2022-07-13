const { UnauthorizedError } = require("../errors");

const checkPermissions = (requestUser, resourceUser) => {
  if (
    requestUser.role === "admin" ||
    requestUser.id === resourceUser.toString()
  ) {
    return;
  }
  throw new UnauthorizedError("Access forbidden");
};

module.exports = checkPermissions;
