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
  Object.keys(validateObject).forEach(async (item) => {
    if (validateObject[item as keyof typeof validateObject]) {
      const vFunc = validateObject[
        item as keyof typeof validateObject
      ] as TValidateFunction;
      const errorResult = (await vFunc(
        // @ts-ignore
        error as Record<keyof T, string>,
        entity[item as keyof T],
        item as keyof T,
        request,
        params
      )) as Promise<Record<keyof T, string>>;
      // @ts-ignore
      error = {
        // @ts-ignore
        ...error,
        ...errorResult,
      };
    }
  });
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
