import { TValidateFunction } from './type-validation'

export const IS_NUMBER: TValidateFunction = <T extends object>(
  error: Record<keyof T, string>,
  value: any,
  key: keyof T
) => {
  if (!value) {
    return { ...error, [key]: 'required' }
  }

  const isNumber = (val: any) => !Number.isNaN(Number(val))

  if (!isNumber(value)) {
    return { ...error, [key]: 'value must be number' }
  }

  return { ...error, [key]: '' }
}
