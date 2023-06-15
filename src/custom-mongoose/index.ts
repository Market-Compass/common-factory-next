import mongoose from "mongoose";
import logger from "../logger";

// CONNECTING TO MONGOOSE (Get Database Url from .env.local)

// connection function
export const connect = async (schema: any, keySchema: string) => {
  const { DATABASE_URL } = process.env;

  type TResult = {
    result?: {
      conn: typeof mongoose;
      data: typeof mongoose.Model<any>;
    };
    error?: string;
  };
  try {
    const conn = await mongoose.connect(DATABASE_URL as string);
    // OUR TODO MODEL
    const data =
      mongoose.models[`${keySchema}`] ||
      mongoose.model(keySchema, schema, keySchema);
    const result: TResult = { result: { conn, data } };
    return result;
  } catch (error: any) {
    logger.error([error.message]);
    const result: TResult = { error: error.message };
    return result;
  }
};
