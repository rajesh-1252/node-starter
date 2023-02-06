import { BadRequestError } from "../errors/index.js";

export const allValuesError = (feilds) => {
  feilds.map((item, index) => {
    if (!item) {
      throw new BadRequestError("Please Provide All Values");
    }
  });
};
