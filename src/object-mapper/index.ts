import mongoose from "mongoose";

export function convertValue<T>(source: object & any, target: object & any) {
  const sourceKeys = Object.keys(source);
  const targetKeys = Object.keys(target);

  const parseValue = (sourceValue: any, targetValue: any): any => {
    if (isValidDate(sourceValue)) {
      if (typeof targetValue === "string") {
        return new Date(sourceValue).toString();
      } else if (typeof targetValue === "number") {
        return new Date(sourceValue).getTime();
      } else {
        return new Date(sourceValue);
      }
    } else if (typeof sourceValue === "number") {
      if (typeof targetValue === "string") {
        return Number(sourceValue).toString();
      } else {
        return undefined;
      }
    } else if (typeof sourceValue === "string") {
      if (typeof targetValue === "number" && isNumber(sourceValue)) {
        return Number(sourceValue);
      } else if (
        isValidDate(new Date(sourceValue)) &&
        isValidDate(targetValue)
      ) {
        return new Date(sourceValue);
      } else if (
        mongoose.isValidObjectId(sourceValue) &&
        typeof targetValue === typeof mongoose.Types.ObjectId
      ) {
        return new mongoose.Types.ObjectId(sourceValue);
      } else {
        return undefined;
      }
    } else if (typeof sourceValue === "boolean") {
      if (typeof targetValue === "number") {
        const _a = sourceValue ? 1 : 0;
        return _a;
      } else if (typeof targetValue === "string") {
        return String(sourceValue);
      } else {
        return undefined;
      }
    } else if (typeof sourceValue === typeof mongoose.Types.ObjectId) {
      if (typeof targetValue === "string") {
        return new mongoose.Types.ObjectId(sourceValue).toString();
      } else {
        return undefined;
      }
    } else if (
      Object.prototype.toString.call(sourceValue) === "[object Object]"
    ) {
      if (Object.prototype.toString.call(targetValue) === "[object Object]") {
        return convertValue(sourceValue, targetValue);
      } else {
        return undefined;
      }
    } else if (
      Object.prototype.toString.call(sourceValue) === "[object Array]"
    ) {
      if (Object.prototype.toString.call(targetValue) === "[object Array]") {
        return sourceValue;
      } else {
        return undefined;
      }
    }
  };

  const isValidDate = (input: any) => {
    if (Object.prototype.toString.call(input) === "[object Date]") return true;
    return false;
  };

  const isNumber = (input: any) => {
    return Number.isFinite(Number(input));
  };

  let result = {};
  for (let i = 0; i < sourceKeys.length; i += 1) {
    if (targetKeys.includes(sourceKeys[i])) {
      const indexTargetKey = targetKeys.indexOf(sourceKeys[i]);
      result = {
        ...result,
        [`${sourceKeys[i]}`]: parseValue(
          source[sourceKeys[i]],
          target[targetKeys[indexTargetKey]]
        ),
      };
    }
  }
  return result as T;
}
