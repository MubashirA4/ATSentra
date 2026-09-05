/**
 * Centralized environment configuration.
 *
 * All environment variables are validated and exported from here.
 * Never import process.env directly in other modules – use this file instead.
 */

const requiredVars = [
  "MONGO_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    console.warn(
      `[config/env] WARNING: Environment variable "${varName}" is not set.`,
    );
  }
}

export const env = {
  /** Node environment (development | production | test) */
  NODE_ENV: process.env.NODE_ENV || "development",

  /** HTTP server port */
  PORT: Number(process.env.PORT) || 5000,

  /** MongoDB connection string */
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai_ats",

  /** JWT secrets */
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "",

  /** JWT expiry durations */
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIREY || "15m",
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIREY || "7d",

  /** CORS allowed origin */
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",

  /** Google Gemini / OpenAI API key (if applicable) */
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",

  /** Upload directory */
  UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads",
};

export default env;
