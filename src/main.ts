import * as express from "express";
import * as helmet from "helmet";
import * as compression from "compression";
import * as cors from "cors";
import { json, urlencoded } from "body-parser";
import * as dotenv from "dotenv";
import { db } from "./config/db.config";
import authRouter from "./routes/auth.route";
import patientRouter from "./routes/patients.route";
import { AuthGuard } from "./guard/auth.guard";
dotenv.config();

async function server() {
  const app: express.Application = express();
  app.use(cors());
  app.use(helmet());
  app.use(compression());
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ limit: "50mb", extended: false }));

  app.set("PORT", app.get("APP_PORT") || 8090);

  db()
    .then(() => console.log(`DB connection successful :: :sparkles:`))
    .catch((err) => console.log(`Unable to connect to database ${err}`));

  app.get(`/health/check`, (req, res) => {
    return res.status(200).json({
      message: `Server is up and running`,
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api/v1", [AuthGuard], [authRouter(), patientRouter()]);

  app.listen(app.get("PORT"), () => {
    console.log(`Application running on port :: ${app.get("PORT")}`);
  });
}

server();
