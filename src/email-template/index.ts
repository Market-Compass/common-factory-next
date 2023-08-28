import axios from "axios";

export const sendEmail = async ({
  content,
  to,
  from,
  subject,
  cc,
}: {
  content: string;
  to: string[];
  from: string;
  subject: string;
  cc?: string[];
}) => {
  const { RESEND_API_KEY } = process.env;
  try {
    const res = axios.post(
      "https://api.resend.com/emails",
      {
        from,
        to,
        subject,
        html: content,
        cc,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
      }
    );
    return (await res).data;
  } catch (err) {
    return err;
  }
};
