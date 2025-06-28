import { log } from "console";
import jwt, {   } from "jsonwebtoken";



export const generateTokens = (payload: object): { accessToken: string; refreshToken: string } => {
  const ACCESS_SECRET = process.env.JWT_SECRET_ACCESS ;
  const REFRESH_SECRET = process.env.JWT_SECRET_REFRESH!;
 const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY!;
  const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY;

  const accessToken = jwt.sign(payload, ACCESS_SECRET!, {expiresIn: ACCESS_EXPIRY as any ?? "1h"});
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY as any ?? "7d" });
  
  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, type: "access" | "refresh"): any => {
  const ACCESS_SECRET = process.env.JWT_SECRET_ACCESS!;
  const REFRESH_SECRET = process.env.JWT_SECRET_REFRESH!;
  
  const secret = type === "access" ? ACCESS_SECRET : REFRESH_SECRET;
  return jwt.verify(token, secret);
};