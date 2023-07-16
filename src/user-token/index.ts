const jwt = require("jsonwebtoken");

export const generateUserToken = (content: { userId: string }) => {
  const date = new Date();
  const exp = date.setDate(date.getDate() + 7);
  const contentJwt = {
    ...content,
    iat: Math.floor(Date.now() / 1000),
    exp: exp / 1000,
  };

  const token = jwt.sign(contentJwt, process.env.USER_JWT_SECRET_KEY || "", {
    algorithm: "HS512",
  });

  return `Bearer ${token}`;
};

export const validateUserToken = (token: string) => {
  return jwt.verify(token, process.env.USER_JWT_SECRET_KEY || "", {
    algorithm: "HS512",
  });
};
