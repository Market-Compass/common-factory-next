import { TValidateFunction } from "./type-validation";

const decodeBase64 = (data: string) => {
  return Buffer.from(data, "base64").toString("ascii");
};

export const IS_PASSWORD: TValidateFunction = async <T extends object>(
  error: Record<keyof T, string>,
  value: any,
  key: keyof T
) => {
  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/g;

  if (!value) {
    return { ...error, [key]: "required" };
  }
  const newValue = String(value);
  const rawPassword = decodeBase64(newValue);
  if (!rawPassword.match(PASSWORD_REGEX)) {
    return { ...error, [key]: "password must pass condition" };
  }
  return { ...error, [key]: "" };
};
