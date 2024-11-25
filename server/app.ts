import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import loginRouter from "./routes/login";
import registerRouter from "./routes/register";
// import indexRouter from "./routes/index.ts.disabled";
// import hiscoresRouter from "./routes/hiscores.ts.disabled";
import feedbackRouter from "./routes/feedback";
import storageRouter from "./routes/storage";
import dotenv from "dotenv";
import { auth } from "express-oauth2-jwt-bearer";
import pluginSyncRouter from "./routes/plugin-sync";
import getDisplayNamesRouter from "./routes/getDisplayNames";


const envFile = process.env.NODE_ENV === "production" ? ".env" : ".env.development";
dotenv.config({ path: envFile });

console.log(`Environment loaded from: ${envFile}`);
console.log(`Database Name: ${process.env.POSTGRES_DATABASE || "Not specified"}`);
const app = express();

const corsConfig = {
  origin: [
    "http://localhost:3000",
    "https://osleague.tools",
    "https://dev.osleague.tools",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type", "Accept"],
  credentials: true,
  exposedHeaders: ["Authorization"],
  optionsSuccessStatus: 200,
};

const jwtCheck = auth({
  issuerBaseURL: process.env.ISSUER_BASE_URL ?? "",
  audience: process.env.AUDIENCE ?? "",
});

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));
app.use("/api/login", loginRouter);
app.use("/api/register", registerRouter);
app.use("/api/storage", storageRouter);
app.use("/api", pluginSyncRouter);
app.use("/api/getDisplayNames", getDisplayNamesRouter);
app.use("/feedback", feedbackRouter);
app.use("/user", (req, res, next) => {
  // Don't require auth for readonly queries
  if (req.method === "GET") {
    next();
    return;
  }

  // Skip bearer auth if valid alternate api key is provided
  if (req.headers["api-key"]) {
    const validKeys = (process.env.VALID_API_KEYS ?? "").split(", ");
    for (const key of validKeys) {
      if (key === req.headers["api-key"]) {
        next();
      }
      res.status(401).send("Unauthorized API key");
    }
  } else {
    jwtCheck(req, res, next);
  }
});

export default app;
