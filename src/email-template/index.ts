const nodemailer = require("nodemailer");

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

  return await transporter.sendMail({
    from: sentFrom,
    ...data,
  });
};
