// 403 forbidden not have authorized to the route

import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api.js";

class UnAuthorizedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCodes = StatusCodes.FORBIDDEN;
  }
}
export default UnAuthorizedError;
