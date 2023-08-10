import * as jwt from "jsonwebtoken";

export const generateToken = (content: { userId: string }, secret: string) => {
  const date = new Date();
  const exp = date.setDate(date.getDate() + 7);
  const contentJwt = {
    ...content,
    iat: Math.floor(Date.now() / 1000),
    exp: exp / 1000,
  };

  const token = jwt.sign(contentJwt, secret, {
    algorithm: "HS512",
  });

  return token;
};

export const validateToken = (token: string, secret: string) => {
  return jwt.verify(token, secret, {
    algorithms: ["HS512"],
  });
};

export const decodeToken = (token: string) => {
  return jwt.decode(token) as { userId: string };
};
