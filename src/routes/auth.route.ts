import * as express from "express";
import AuthController from "../controllers/auth.controller";
import { AuthPolicy } from "../policies/auth.policy";
const router: express.Router = express.Router();
export default () => {
  router.post(`/auth/register`, [AuthController.register]);
  router.post(`/auth/login`, [AuthPolicy.login], [AuthController.login]);
  router.get(`/user/profile/me`, AuthController.me);
  return router;
};
