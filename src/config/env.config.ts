import * as dotenv from "dotenv";
dotenv.config();
export const env = {
  auth: {
    secret: process.env.JWT_SECRET,
  },
};
