import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve("src", ".env") })

// Generacionde token y token refresh
const generateToken = (user, isRefresh) => {
  if (isRefresh) {
    return jwt.sign(user, process.env.TOKEN_SECRET_REFRESH, {
      expiresIn: "90min"
    })
  }
  return jwt.sign(user, process.env.TOKEN_SECRET, {
    expiresIn: "15min"
  })
};

export { generateToken }