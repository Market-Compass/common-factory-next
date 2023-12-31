import * as logger from "npmlog";

import { CommonResponse } from "../types";

export const wrapperEndpoint = async <T>(
  req: any,
  method: "GET" | "PUT" | "POST" | "DELETE",
  serviceFunc: Promise<CommonResponse<T>>,
  referer?: string
): Promise<CommonResponse<T | string>> => {
  logger.enableColor();
  try {
    if (req.url) {
      logger.info("controller", "request-url", req.url);
    }
    if (referer && !referer.includes(process.env.HOST || "")) {
      logger.info("controller", "host", req.headers.referer);
      return {
        success: false,
        message: "not support",
        result: "",
        status: 401,
      };
    }
    if (req.query) {
      Object.keys(req.query).map((item) => {
        logger.info(
          "controller",
          "request-params",
          `${item}=${req.query[item]}`
        );
      });
    }
    if (req.body) {
      logger.info("controller", "request-params", `${req.body}`);
    }
    if (req.method !== method) {
      return {
        success: false,
        message: "not support method",
        result: "",
        status: 400,
      };
    }
    const result = await serviceFunc;
    return result;
  } catch (err: any) {
    logger.error("server", "-dead", err.message);
    return {
      status: 500,
      result: "",
      message: String(err.message),
      success: false,
    };
  }
};
