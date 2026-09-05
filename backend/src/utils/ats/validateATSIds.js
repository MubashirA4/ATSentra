import mongoose from "mongoose";

export const validateMongoId = (
  value,
  fieldName,
) => {
  if (!value) {
    throw new Error(
      `${fieldName} is required`,
    );
  }

  if (
    !mongoose.Types.ObjectId.isValid(
      value,
    )
  ) {
    throw new Error(
      `Invalid ${fieldName}`,
    );
  }

  return true;
};