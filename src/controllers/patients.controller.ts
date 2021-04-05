import { Request, Response } from "express";
import Issues from "../models/issues.schema";
import Patients from "../models/patients.schema";
import { slugify } from "../utils/helpers";
import { SchemaTypes, Types } from "mongoose";
let PatientController = {
  async list(req: Request, res: Response) {
    const { page, limit } = req.query;
    try {
      const response = await Patients.paginate(
        {},
        {
          page: Number(page),
          limit: Number(limit),
          sort: {
            created_at: "DESC",
          },
          populate: "userId",
        }
      );
      return res.status(200).json({
        message: `List of patients`,
        success: true,
        data: response,
      });
    } catch (e) {
      return res.status(500).json({
        message: `Unable to get patient list`,
        timestamp: new Date().toISOString(),
        path: req.path,
        error: e?.message,
      });
    }
  },
  async listIssuesByPatientId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { page, limit } = req.query;
      const response = await Issues.paginate(
        {
          userId: Types.ObjectId(id),
        },
        { page: Number(page), limit: Number(limit) }
      );
      return res.status(200).json({
        message: `List of issues for patient`,
        success: true,
        data: response,
      });
    } catch (e) {
      return res.status(500).json({
        message: `Unable to create issue`,
        timestamp: new Date().toISOString(),
        path: req.path,
        error: e?.message,
      });
    }
  },
  async createIssueByPatient(req: Request, res: Response) {
    try {
      const { title } = req.body;
      const issue = await Issues.findOne({
        slug: slugify(title),
      });
      if (!issue) {
        const response = await Issues.create({
          ...req.body,
          slug: slugify(title),
          userId: (req as any)?.decoded?.id,
        });
        return res.status(201).json({
          message: `Medical issue sent successfully`,
          success: true,
          data: response,
        });
      }
      return res.status(409).json({
        message: `Medical issue already exist`,
        success: true,
        data: issue,
      });
    } catch (e) {
      return res.status(500).json({
        message: `Unable to create issue`,
        timestamp: new Date().toISOString(),
        path: req.path,
        error: e?.message,
      });
    }
  },
  async updateIssueByPatient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, content, dateStarted } = req.body;
      const issue = await Issues.findOne({
        _id: id,
      });
      if (!issue) {
        return res.status(404).json({
          message: `Medical issue doesn't exist`,
          error: `Medical issue doesn't exist in our system`,
          timestamp: new Date().toISOString(),
          path: req.path,
        });
      }
      const response = await Issues.updateOne(
        {
          _id: id,
        },
        { slug: slugify(title), title, content, dateStarted }
      );
      return res.status(409).json({
        message: `Medical issue update successfully`,
        success: true,
        data: response,
      });
    } catch (e) {
      return res.status(500).json({
        message: `Unable to create issue`,
        timestamp: new Date().toISOString(),
        path: req.path,
        error: e?.message,
      });
    }
  },
  async listPatientsReportedIssues(req: Request, res: Response) {
    try {
      const { page, limit } = req.query;
      const { id } = (req as any)?.decoded;
      const response = await Issues.paginate(
        {
          userId: Types.ObjectId(id),
        },
        { page: Number(page), limit: Number(limit) }
      );
      return res.status(200).json({
        message: `List of issues for patient`,
        success: true,
        data: response,
      });
    } catch (e) {
      return res.status(500).json({
        message: `Unable to list patient issue`,
        timestamp: new Date().toISOString(),
        path: req.path,
        error: e?.message,
      });
    }
  },
  async deleteIssueByPatient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const issue = await Issues.findOne({
        _id: Types.ObjectId(id),
      });
      if (!issue) {
        return res.status(404).json({
          message: `Medical issue doesn't exist`,
          error: `Medical issue doesn't exist in our system`,
          timestamp: new Date().toISOString(),
          path: req.path,
        });
      }
      const response = await Issues.deleteOne({
        _id: Types.ObjectId(id),
      });
      return res.status(200).json({
        message: `Medical issue deleted successfully`,
        success: true,
        data: response,
      });
    } catch (e) {
      return res.status(500).json({
        message: `Unable to delete this issue`,
        timestamp: new Date().toISOString(),
        path: req.path,
        error: e?.message,
      });
    }
  },
};

export default PatientController;
