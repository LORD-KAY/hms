import { Request } from "express";
import { Response } from "express";
import { NextFunction } from "express";
import * as Joi from "joi";
export const IssuePolicy = {
  async createIssue(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      title: Joi.string().min(6).required(),
      content: Joi.string().required(),
      dateStarted: Joi.date().required(),
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
};
