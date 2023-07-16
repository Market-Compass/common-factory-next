import mongoose from "mongoose";

export function convertValue<T>(source: object & any, target: object & any) {
  const sourceKeys = Object.keys(source);
  const targetKeys = Object.keys(target);

  const isValidDate = (input: any) => {
    if (Object.prototype.toString.call(input) === "[object Date]") return true;
    return false;
  };

  const isNumber = (input: any) => {
    return Number.isFinite(Number(input));
  };

  let result = {};
  const excludes: string[] = [];
  for (let i = 0; i < sourceKeys.length; i += 1) {
    if (targetKeys.includes(sourceKeys[i])) {
      const indexTargetKey = targetKeys.indexOf(sourceKeys[i]);
      if (isValidDate(source[sourceKeys[i]])) {
        if (typeof target[targetKeys[indexTargetKey]] === "string") {
          result = {
            ...result,
            [`${sourceKeys[i]}`]: new Date(source[sourceKeys[i]]).toString(),
          };
        } else if (typeof target[targetKeys[indexTargetKey]] === "number") {
          result = {
            ...result,
            [`${sourceKeys[i]}`]: new Date(source[sourceKeys[i]]).getTime(),
          };
        } else {
          result = {
            ...result,
            [`${sourceKeys[i]}`]: new Date(source[sourceKeys[i]]),
          };
        }
        excludes.push(sourceKeys[i]);
      } else if (typeof source[sourceKeys[i]] === "number") {
        if (typeof target[targetKeys[indexTargetKey]] === "string") {
          result = {
            ...result,
            [`${sourceKeys[i]}`]: Number(source[sourceKeys[i]]).toString(),
          };
        } else {
          result = {
            ...result,
            [`${sourceKeys[i]}`]: Number(source[sourceKeys[i]]),
          };
        }
        excludes.push(sourceKeys[i]);
      } else if (typeof source[sourceKeys[i]] === "string") {
        if (
          typeof target[targetKeys[indexTargetKey]] === "number" &&
          isNumber(source[sourceKeys[i]])
        ) {
          result = {
            ...result,
            [`${sourceKeys[i]}`]: Number(source[sourceKeys[i]]),
          };
        } else if (
          isValidDate(new Date(source[sourceKeys[i]])) &&
          isValidDate(target[targetKeys[indexTargetKey]])
        ) {
          result = {
            ...result,
            [`${sourceKeys[i]}`]: new Date(source[sourceKeys[i]]),
          };
        } else if (
          mongoose.isValidObjectId(source[sourceKeys[i]]) &&
          typeof target[targetKeys[indexTargetKey]] ===
            typeof mongoose.Types.ObjectId
        ) {
          result = {
            ...result,
            [`${sourceKeys[i]}`]: new mongoose.Types.ObjectId(
              source[sourceKeys[i]]
            ),
          };
        } else {
          result = { ...result, [`${sourceKeys[i]}`]: source[sourceKeys[i]] };
        }
        excludes.push(sourceKeys[i]);
      } else if (typeof source[sourceKeys[i]] === "boolean") {
        if (typeof target[targetKeys[indexTargetKey]] === "number") {
          result = {
            ...result,
            [`${sourceKeys[i]}`]: source[sourceKeys[i]] ? 1 : 0,
          };
        } else if (typeof target[targetKeys[indexTargetKey]] === "string") {
          result = {
            ...result,
            [`${sourceKeys[i]}`]: String(source[sourceKeys[i]]),
          };
        } else {
          result = { ...result, [`${sourceKeys[i]}`]: source[sourceKeys[i]] };
        }
        excludes.push(sourceKeys[i]);
      } else if (
        typeof source[sourceKeys[i]] === typeof mongoose.Types.ObjectId
      ) {
        if (typeof target[targetKeys[indexTargetKey]] === "string") {
          result = {
            ...result,
            [`${sourceKeys[i]}`]: new mongoose.Types.ObjectId(
              source[sourceKeys[i]]
            ).toString(),
          };
        } else {
          result = { ...result, [`${sourceKeys[i]}`]: source[sourceKeys[i]] };
        }
        excludes.push(sourceKeys[i]);
      }
    }
    for (let i = 0; i < targetKeys.length; i += 1) {
      if (!excludes.includes(targetKeys[i])) {
        result = { ...result, [`${targetKeys[i]}`]: target[targetKeys[i]] };
      }
    }
  }
  return result as T;
}
