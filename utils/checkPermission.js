import { UnAuthorizedError } from "../errors/index.js";

const checkPermission = (requestUser, resourseUserId) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourseUserId.toString());

  throw new UnAuthorizedError("Not authorized to this route");
};

export default checkPermission;
