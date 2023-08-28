import * as nodemailer from "nodemailer";

import { logger } from "..";

type EmailPayload = {
  to: string | string[];
  subject: string;
  html: string;
};

type ServerMailOptions = {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
};

export const sendEmail = async (
  smtpOptions: ServerMailOptions,
  sentFrom: string,
  data: EmailPayload
) => {
  const transporter = nodemailer.createTransport({
    ...smtpOptions,
  });

  return await new Promise((res, rej) => {
    transporter.sendMail(
      {
        from: sentFrom,
        ...data,
      },
      (err, info) => {
        if (err) {
          logger.enableColor();
          logger.error("send email", "send email err", String(err));
          rej(err);
        } else {
          res(info);
        }
      }
    );
  });
};
