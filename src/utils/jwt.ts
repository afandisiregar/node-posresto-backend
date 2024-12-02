import { AccessTokenPayload } from "../types/Auth";
import jsonwebtoken from "jsonwebtoken";
import CONFIG from "../config";

const generateAccessToken = (payload: AccessTokenPayload) => {
  const token = jsonwebtoken.sign(payload, CONFIG.JWT_SECRET, {
    expiresIn: CONFIG.JWT_EXPIRY,
    issuer: CONFIG.FRONTEND_DOMAIN,
  });

  return token;
};

const generateRefreshToken = (payload: AccessTokenPayload) => {
  const token = jsonwebtoken.sign(payload, CONFIG.JWT_SECRET, {
    expiresIn: CONFIG.JWT_EXPIRY_REFRESH,
    issuer: CONFIG.FRONTEND_DOMAIN_COOKIE,
  });
  return token;
};

const verifyToken = (token: string) => {
  const decodedToken = jsonwebtoken.verify(token, CONFIG.JWT_SECRET, {
    issuer: CONFIG.FRONTEND_DOMAIN,
  });

  return decodedToken;
};

export { generateAccessToken, generateRefreshToken, verifyToken };
