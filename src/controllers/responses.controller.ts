import { Request, Response } from "express";
import { Types } from "mongoose";
import Responses from "../models/response.schema";
let ResponsesController = {
  async list(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const response = await Responses.find({
        isArchived: false,
        issueId: Types.ObjectId(id),
      })
        .populate(["userId", "issueId"])
        .exec();
      return res.status(200).json({
        message: `List of responses`,
        success: true,
        data: response,
      });
    } catch (e) {
      return res.status(500).json({
        message: `Unable to get list of response`,
        timestamp: new Date().toISOString(),
        path: req.path,
        error: e?.message,
      });
    }
  },
  async createResponse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const response = await Responses.create({
        userId: (req as any)?.decoded?.id,
        ...req.body,
        issueId: Types.ObjectId(id),
        fromPatient: !((req as any)?.decoded?.userType === "doctor"),
      });
      return res.status(201).json({
        message: `Issue successfully responded`,
        success: true,
        data: response,
      });
    } catch (e) {
      return res.status(500).json({
        message: `Unable to get list of response`,
        timestamp: new Date().toISOString(),
        path: req.path,
        error: e?.message,
      });
    }
  },
  async listArchiveResponse(req: Request, res: Response) {
    try {
      const { id } = (req as any)?.decoded;
      const response = await Responses.find({
        userId: Types.ObjectId(id),
        isArchived: true,
      });
      return res.status(200).json({
        message: `List of archived messages`,
        success: true,
        data: response,
      });
    } catch (e) {
      return res.status(500).json({
        message: `Unable to list archived messages`,
        timestamp: new Date().toISOString(),
        path: req.path,
        error: e?.message,
      });
    }
  },
  async archiveResponse(req: Request, res: Response) {
    try {
      const { responseId } = req.params;
      const response = await Responses.updateOne(
        {
          _id: responseId,
        },
        { isArchived: true }
      ).exec();
      return res.status(200).json({
        message: `Message archived successfully`,
        success: true,
        data: response,
      });
    } catch (e) {
      return res.status(500).json({
        message: `Unable to archive a message`,
        timestamp: new Date().toISOString(),
        path: req.path,
        error: e?.message,
      });
    }
  },
};

export default ResponsesController;
