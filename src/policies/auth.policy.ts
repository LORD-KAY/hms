import { Request } from "express";
import { Response } from "express";
import { NextFunction } from "express";
import * as Joi from "joi";
export const AuthPolicy = {
  async login(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      username: Joi.string().min(6).required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(423).json({
        message: error.message,
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    } else {
      next();
    }
  },
  async register(req: Request, res: Response, next: NextFunction) {},
};
