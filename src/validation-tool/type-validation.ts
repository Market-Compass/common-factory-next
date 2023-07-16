export type TValidateFunction = <T extends object>(
  error: Record<keyof T, string>,
  value: any,
  key: keyof T,
  params?: any
) => Promise<Record<keyof T, string>>;
