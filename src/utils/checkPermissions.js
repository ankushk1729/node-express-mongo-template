import UnauthorizedError from "../errors/Unauthorized.js";

const checkPermissions = (requestUser, resourceUser) => {
  if (
    requestUser.role === "admin" ||
    requestUser.id === resourceUser.toString()
  ) {
    return;
  }
  throw new UnauthorizedError("Access forbidden");
};

export default checkPermissions;
