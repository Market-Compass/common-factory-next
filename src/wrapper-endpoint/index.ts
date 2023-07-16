import { CommonResponse } from "../types";

export const wrapperEndpoint = async <T>(
  req: { method?: string },
  method: "GET" | "PUT" | "POST" | "DELETE",
  serviceFunc: Promise<CommonResponse<T>>
): Promise<CommonResponse<T | string>> => {
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
};
