export type TValidateFunction = <T extends object, E, F>(
  error: Record<keyof T, string>,
  value: any,
  key: keyof T,
  request?: E,
  params?: F
) => Record<keyof T, string>;
