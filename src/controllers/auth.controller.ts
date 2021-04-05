import { genSaltSync, hashSync } from "bcrypt";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import Users from "../models/user.schema";
import Patients from "../models/patients.schema";
import { isValidPassword } from "../utils/helpers";
import { config } from "../config/config";
let AuthController = {
  async register(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const response = await Users.findOne({ username }).exec();
      if (!response) {
        const user = await Users.create({
          ...req.body,
          password: hashSync(password, genSaltSync()),
        });
        if (user) {
          await Patients.create({
            userId: user?._id,
          });
        }
        return res.status(201).json({
          message: `User successfully registered, Kindly log in with your username and password`,
          success: true,
          data: user,
        });
      }
      return res.status(409).json({
        message: `User already exist with same username`,
        success: false,
        data: response,
      });
    } catch (e) {
      return res.status(500).json({
        message: `Unable to register user ${e?.message}`,
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
  },
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const auth = await Users.findOne({
        $or: [{ username }, { email: username }],
      }).exec();
      if (!auth) {
        return res.status(401).json({
          message: `Invalid email or email address provided`,
          path: req.path,
          timestamp: new Date().toISOString(),
        });
      }
      const isPasswordValid = isValidPassword(password, auth.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          message: `Invalid password provided`,
          path: req.path,
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(200).json({
        message: `User successfully logged in`,
        data: {
          accessToken: sign(
            { username, userType: auth?.userType, id: auth?._id },
            config.get("auth.secret"),
            {
              expiresIn: "1h",
              issuer: `hms`,
              audience: `hms-testing`,
            }
          ),
          userType: auth?.userType,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      return res.status(500).json({
        message: `Unable to login user ${e?.message}`,
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
  },
};

export default AuthController;
