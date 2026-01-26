import path from "path";
import dotenv from "dotenv";

process.env.GITHUB_WEBHOOK_SECRET = "test-secret-for-env";
process.env.SESSION_SECRET = "test-session-secret";
process.env.NODE_ENV = "test";

const dotenvPath =
  process.env.DOTENV_CONFIG_PATH || path.join(__dirname, ".env.test");
dotenv.config({ path: dotenvPath, override: true });
