import { TValidateFunction } from './type-validation'

export const IS_PHONE: TValidateFunction = <T extends object>(
  error: Record<keyof T, string>,
  value: any,
  key: keyof T
) => {
  const PHONE_REGEX = /^(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})$/g
  if (!value) {
    return { ...error, [key]: 'required' }
  }
  const newValue = String(value)
  if (!newValue.match(PHONE_REGEX)) {
    return { ...error, [key]: 'invalid phone' }
  }
  return { ...error, [key]: '' }
}
