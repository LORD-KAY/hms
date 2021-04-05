import * as express from "express";
import PatientController from "../controllers/patients.controller";
import { IssuePolicy } from "../policies/issues.policy";

const router: express.Router = express.Router();
export default () => {
  router.route(`/admin/patients`).get(PatientController.list);

  router.get(
    `/admin/patients/:id/issues`,
    PatientController.listIssuesByPatientId
  );

  router.get(
    `/patients/all/reported/issues`,
    PatientController.listPatientsReportedIssues
  );
  router.post(
    `/patients/report/issue`,
    IssuePolicy.createIssue,
    PatientController.createIssueByPatient
  );
  router
    .route(`/patients/issue/:id`)
    .put(IssuePolicy.createIssue, PatientController.updateIssueByPatient)
    .delete(PatientController.deleteIssueByPatient);

  return router;
};
