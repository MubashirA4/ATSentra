import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import resumeRoutes from "./routes/resume.js";
import atsDecisionRoutes from "./routes/ats/atsDecision.js";
import atsAnalysisRoutes from "./routes/ats/atsAnalysis.js";
import jobRoutes from "./routes/jobs/job.js";
import candidateRoutes from "./routes/candidates/candidate.js";

import { errorHandler } from "./middleware/error.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ats", atsDecisionRoutes);
app.use("/api/ats", atsAnalysisRoutes);
app.use("/api/jobs", jobRoutes);

app.use("/api/candidates", candidateRoutes);


app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI ATS app is running",
  });
});
app.use(errorHandler);

export default app;
