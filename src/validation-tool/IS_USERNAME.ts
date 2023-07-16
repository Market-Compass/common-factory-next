import { TValidateFunction } from './type-validation'

export const IS_USERNAME: TValidateFunction = <T extends object>(
  error: Record<keyof T, string>,
  value: any,
  key: keyof T
) => {
  if (!value) {
    return { ...error, [key]: 'required' }
  }
  const newValue = String(value)
  const USERNAME_REGEX = /^[a-zA-Z0-9\\._\\-]{3,}$/g

  if (!newValue.match(USERNAME_REGEX)) {
    return { ...error, [key]: 'invalid username' }
  }
  return { ...error, [key]: '' }
}
