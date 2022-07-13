import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-error.js";

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
export default BadRequestError;
