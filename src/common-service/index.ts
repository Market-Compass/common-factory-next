import mongoose, { PipelineStage } from "mongoose";
import { convertValue } from "../object-mapper";
import { CommonListResult, CommonResponse, PipelineResponse } from "../types";

export class CommonService<T> {
  repository: T;

  constructor(repo: T) {
    this.repository = repo;
  }

  async responseList<E, F>(
    val: PipelineResponse<CommonListResult<E>>,
    initRes: F
  ): Promise<CommonResponse<CommonListResult<F> | string>> {
    const { error, result } = val;
    if (result) {
      return {
        result: {
          ...result,
          data: result.data.map((item) => convertValue(item, initRes)),
        },
        status: 200,
        success: true,
        message: "ok",
      };
    }
    return {
      status: 500,
      message: error || "",
      success: false,
      result: "",
    };
  }

  generatePipelineAggregate<T extends object>(
    params: object,
    entity: T
  ): PipelineStage[] {
    const paramKeys = Object.keys(params);
    const entityKeys = Object.keys(entity);
    const result: PipelineStage[] = [];
    paramKeys.forEach((paramKey) => {
      if (entityKeys.includes(paramKey)) {
        const paramValue = params[paramKey as keyof typeof params] as string;
        const values: string[] = paramValue.split(",");
        const keyType = typeof entity[paramKey as keyof typeof entity];
        const valueAndCond = values
          .map((thisVal) => {
            return this.generateValueCondition(
              keyType,
              paramKey,
              thisVal,
              entity[paramKey as keyof typeof entity]
            );
          })
          .filter((thisVal) => Object.keys(thisVal).length > 0);
        result.push({
          $match: {
            $or: valueAndCond,
          },
        });
      }
    });
    return result;
  }

  generateValueCondition<T extends object>(
    type: keyof T,
    key: string,
    value: any,
    valueEntity: any
  ): { [key: string]: any } {
    if (mongoose.isValidObjectId(value)) {
      return { [`${key}`]: new mongoose.Types.ObjectId(value) };
    }
    if (Array.isArray(valueEntity)) {
      try {
        const valueParse = JSON.parse(value);
        const valueKeys = Object.keys(valueParse);
        return {
          $and: valueKeys.map((item) => {
            return {
              [`${key}.${item}`]: {
                $in: [new RegExp(valueParse[item], "g"), `$${key}.${item}`],
              },
            };
          }),
        };
      } catch (err) {
        if (Number.isFinite(Number(value))) {
          return {
            [`${key}`]: {
              $in: [Number(value), `$${key}`],
            },
          };
        }
        if (typeof value === "string") {
          return {
            [`${key}`]: {
              $in: [new RegExp(value, "g"), `$${key}`],
            },
          };
        }
        return {};
      }
    }
    switch (type) {
      case "string": {
        return { [`${key}`]: new RegExp(value, "g") };
      }
      case "number": {
        if (!Number.isFinite(Number(value))) {
          return {};
        }
        return { [`${key}`]: Number(value) };
      }
      case "boolean": {
        return { [`${key}`]: Boolean(value) };
      }
      case "object": {
        if (Object.prototype.toString.call(value) === "[object Date]") {
          return { [`${key}`]: new Date(value) };
        }
        return {};
      }
      default: {
        return {};
      }
    }
  }

  getPageAndSize(req: {
    query: {
      page: number;
      size: number;
    };
  }) {
    return {
      page: Number(req.query.page) || 1,
      size: Number(req.query.size) || 10,
    };
  }
}
