import { TValidateFunction } from "./type-validation";

export type ObjectValidator<T extends object> = {
  [key in keyof T]?: TValidateFunction;
};

export const validate = async <T extends object, E, F>(
  entity: T,
  validateObject: ObjectValidator<T>,
  request?: E,
  params?: F
) => {
  let error = {} as Record<keyof T, string>;
  Object.keys(entity).forEach((key) => {
    error = { ...error, [key]: "" };
  });
  const validateKeys = Object.keys(validateObject);
  for (let i = 0; i < validateKeys.length; i++) {
    if (validateObject[validateKeys[i] as keyof typeof validateObject]) {
      const vFunc = validateObject[
        validateKeys[i] as keyof typeof validateObject
      ] as TValidateFunction;
      const errorResult = (await vFunc(
        error as Record<keyof T, string>,
        entity[validateKeys[i] as keyof T],
        validateKeys[i] as keyof T,
        request,
        params
      )) as Promise<Record<keyof T, string>>;
      error = {
        ...error,
        [`${validateKeys[i]}`]:
          errorResult[validateKeys[i] as keyof typeof errorResult],
      };
    }
  }
  const isError: boolean =
    Object.keys(error).filter(
      (keyError) => error[keyError as keyof typeof error]
    )?.length > 0;
  return {
    error: error as Record<keyof T, string>,
    isError,
  };
};

export * from "./IS_EMAIL";
export * from "./IS_NUMBER";
export * from "./IS_PASSWORD";
export * from "./IS_PHONE";
export * from "./IS_REQUIRED";
export * from "./IS_USERNAME";
