import mongoose, { PipelineStage } from "mongoose";
import { convertValue } from "object-mapper-fares-system";
import logger from "../logger";
import { CommonListResult, CommonResponse, PipelineResponse } from "../types";

export class CommonService<T> {
  repository: T;

  constructor(repo: T) {
    this.repository = repo;
  }

  genRes<E>(
    result: E,
    status: number,
    message: string,
    success: boolean
  ): Promise<CommonResponse<E>> {
    return Promise.resolve({
      status,
      result,
      message,
      success,
    });
  }

  responseList<E, F>(
    val: PipelineResponse<CommonListResult<E>>,
    initRes: F
  ): Promise<CommonResponse<CommonListResult<F> | string>> {
    const { error, result } = val;
    if (result) {
      return this.genRes<CommonListResult<F>>(
        {
          ...result,
          data: result.data.map((item) => convertValue(item, initRes)),
        },
        200,
        "ok",
        true
      );
    }
    return this.genRes<string>("", 500, error || "", false);
  }

  responseVoid<E>(
    val: PipelineResponse<E>
  ): Promise<CommonResponse<E | string>> {
    const { error, result } = val;
    if (result) {
      return this.genRes(result, 200, "ok", true);
    }
    return this.genRes<string>("", 500, error || "", false);
  }

  generatePipelineAggregate<T extends object>(
    params: object,
    entity: T
  ): PipelineStage[] {
    const paramKeys = Object.keys(params);
    const entityKeys = Object.keys(entity);
    let result: PipelineStage.Match = {
      $match: {
        $or: [],
      },
    };
    paramKeys.forEach((paramKey) => {
      if (entityKeys.includes(paramKey)) {
        const paramValue = params[paramKey as keyof typeof params] as string;
        const values: string[] = paramValue.split(",");
        const keyType = typeof entity[paramKey as keyof typeof entity];
        const valueAndCond = values
          .map((thisVal) => {
            return this.generateValueCondition(keyType, paramKey, thisVal);
          })
          .filter((thisVal) => Object.keys(thisVal).length > 0);
        valueAndCond.forEach((item) => logger.info([item as any]));
        result = {
          $match: {
            $or: result.$match.$or
              ? [
                  ...result.$match.$or,
                  {
                    $and: valueAndCond,
                  },
                ]
              : [
                  {
                    $and: valueAndCond,
                  },
                ],
          },
        };
      }
    });
    if (result.$match.$or!.length === 0) {
      return [];
    }
    return [result];
  }

  generateValueCondition<T extends object>(
    type: keyof T,
    key: string,
    value: any
  ): { [key: string]: any } {
    if (mongoose.isValidObjectId(value)) {
      return { [`${key}`]: new mongoose.Types.ObjectId(value) };
    }
    switch (type) {
      case "string": {
        return { [`${key}`]: value };
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
