import { TValidateFunction } from "./type-validation";

export const IS_EMAIL: TValidateFunction = async <T extends object>(
  error: Record<keyof T, string>,
  value: any,
  key: keyof T
) => {
  const EMAIL_REGEX =
    /^(?=.{1,64}@)[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/g;

  if (!value) {
    return { ...error, [key]: "required" };
  }
  const newValue = String(value);
  if (!newValue.match(EMAIL_REGEX)) {
    return { ...error, [key]: "invalid email" };
  }
  return { ...error, [key]: "" };
};
