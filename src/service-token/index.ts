const jwt = require("jsonwebtoken");

export const generateServiceToken = (content: { serviceName: string }) => {
  const date = new Date();
  const exp = date.setDate(date.getDate() + 7);
  const contentJwt = {
    ...content,
    iat: Math.floor(Date.now() / 1000),
    exp: exp / 1000,
  };

  const token = jwt.sign(contentJwt, process.env.SERVICE_JWT_SECRET_KEY || "", {
    algorithm: "HS512",
  });

  return `Bearer ${token}`;
};

export const validateServiceToken = (token: string) => {
  return jwt.verify(token, process.env.SERVICE_JWT_SECRET_KEY || "", {
    algorithm: "HS512",
  });
};
