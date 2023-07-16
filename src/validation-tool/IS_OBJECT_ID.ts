import mongoose from "mongoose";
import { TValidateFunction } from "./type-validation";

export const IS_OBJECT_ID: TValidateFunction = <T extends object>(
  error: Record<keyof T, string>,
  value: any,
  key: keyof T
) => {
  if (!value) {
    return { ...error, [key]: "required" };
  }
  const newValue = String(value);
  if (!mongoose.isValidObjectId(newValue)) {
    return { ...error, [key]: "invalid object id" };
  }
  return { ...error, [key]: "" };
};
