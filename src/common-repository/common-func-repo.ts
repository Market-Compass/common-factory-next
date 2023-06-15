import { AnyKeys, PipelineStage } from "mongoose";
import { connect } from "../custom-mongoose";
import logger from "../logger";
import { PipelineResponse } from "../types";

export async function findFunc<T>(
  schema: any,
  keySchema: string,
  pipelines: PipelineStage[],
  pageProp: number,
  sizeProp: number
): Promise<
  PipelineResponse<{
    data: T[];
    total: number;
    page: number;
    size: number;
  }>
> {
  const { result, error } = await connect(schema, keySchema);
  if (error) {
    return {
      error,
    };
  }
  if (result) {
    const { data } = result;
    let page = 1;
    let size = 10;
    if (pageProp) {
      page = pageProp;
    }
    if (sizeProp) {
      size = sizeProp;
    }
    try {
      const thisResult = await data.aggregate([
        ...pipelines,
        {
          $facet: {
            metadata: [
              {
                $count: "total",
              },
            ],
            data: [{ $skip: page - 1 }, { $limit: size }],
          },
        },
      ]);
      return {
        result: {
          data: thisResult[0].data,
          total: thisResult[0].metadata[0]?.total || 0,
          page,
          size,
        },
      };
    } catch (error: any) {
      logger.error([error.message]);
      return {
        error: error.message,
      };
    }
  }
  return {
    error: "no result",
  };
}

export async function findOneFunc<T>(
  schema: any,
  keySchema: string,
  value: any,
  field: string
): Promise<PipelineResponse<T>> {
  const { result, error } = await connect(schema, keySchema);
  if (error) {
    return {
      error,
    };
  }
  if (result) {
    const { data } = result;
    try {
      const thisResult = (await data.aggregate([
        {
          $match: {
            [`${field}`]: value,
          },
        },
      ])) as T[];
      return {
        result: thisResult[0],
      };
    } catch (error: any) {
      logger.error([error.message]);
      return {
        error: error.message,
      };
    }
  }
  return {
    error: "no result",
  };
}

export async function insertManyFunc<T>(
  schema: any,
  keySchema: string,
  entities: T[]
): Promise<PipelineResponse<string>> {
  const { result, error } = await connect(schema, keySchema);
  if (error) {
    return {
      error,
    };
  }
  if (result) {
    const { data } = result;
    try {
      await data.insertMany(entities);
      return {
        result: "success",
      };
    } catch (error: any) {
      logger.error([error.message]);
      return {
        error: error.message,
      };
    }
  }
  return {
    error: "no result",
  };
}

export async function updateManyFunc<T>(
  schema: any,
  keySchema: string,
  entities: T[]
): Promise<PipelineResponse<string>> {
  const { result, error } = await connect(schema, keySchema);
  if (error) {
    return {
      error,
    };
  }
  if (result) {
    const { data } = result;
    try {
      await Promise.all(
        entities.map(async (item) => {
          await data.findByIdAndUpdate(item["_id" as keyof typeof item], {
            $set: { ...item, _id: undefined } as AnyKeys<any>,
          });
        })
      );
      return {
        result: "success",
      };
    } catch (error: any) {
      logger.error([error.message]);
      return {
        error: error.message,
      };
    }
  }
  return {
    error: "no result",
  };
}

export async function deleteFunc(
  schema: any,
  keySchema: string,
  ids: string[]
): Promise<PipelineResponse<string>> {
  const { result, error } = await connect(schema, keySchema);
  if (error) {
    return {
      error,
    };
  }
  if (result) {
    const { data } = result;
    try {
      await data.deleteMany({
        $or: ids.map((thisId) => {
          return {
            _id: thisId,
          };
        }),
      });
      return {
        result: "success",
      };
    } catch (error: any) {
      logger.error([error.message]);
      return {
        error: error.message,
      };
    }
  }
  return {
    error: "no result",
  };
}
