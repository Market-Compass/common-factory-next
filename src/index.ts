import * as bcrypt_tool from "bcrypt";
import * as jwt_tool from "jsonwebtoken";
import * as mongoose_tool from "mongoose";
import * as nodemailer_tool from "nodemailer";
import * as log from "npmlog";
import * as uuid_tool from "uuid";

export * from "./base64-utils";
export * from "./common-repository";
export * from "./common-service";
export * from "./custom-mongoose";
export * from "./email-template";
export * from "./object-mapper";
export * from "./password-utils";
export * from "./string-utils";
export * from "./tool-token";
export * from "./types";
export * from "./validation-tool";
export * from "./wrapper-endpoint";

export const logger = log;
export const mongoose = mongoose_tool;
export const jwt = jwt_tool;
export const bcrypt = bcrypt_tool;
export const uuid = uuid_tool;
export const nodemailer = nodemailer_tool;
