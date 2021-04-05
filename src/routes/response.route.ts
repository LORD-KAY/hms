import * as express from "express";
import ResponsesController from "../controllers/responses.controller";
import { IssuePolicy } from "../policies/issues.policy";
const router: express.Router = express.Router();
export default () => {
  router
    .route(`/patients/issue/:id/response`)
    .get(ResponsesController.list)
    .post(IssuePolicy.createResponse, ResponsesController.createResponse);

  router.put(
    `/patients/response/:responseId`,
    ResponsesController.archiveResponse
  );
  router.get(
    `/patients/response/archive/list`,
    ResponsesController.listArchiveResponse
  );
  return router;
};
