import fs from "fs";
import path from "path";
import dotenv from "dotenv";

process.env.GITHUB_WEBHOOK_SECRET = "test-secret-for-env";
process.env.SESSION_SECRET = "test-session-secret";
process.env.NODE_ENV = "test";

const hasDbEnv =
  !!process.env.DB_HOST ||
  !!process.env.DB_PORT ||
  !!process.env.DB_USER ||
  !!process.env.DB_NAME;

if (!hasDbEnv) {
  const defaultEnvTest = path.join(__dirname, ".env.test");
  const fallbackEnvTest = path.join(__dirname, ".env.test.example");
  const dotenvPath =
    process.env.DOTENV_CONFIG_PATH ||
    (fs.existsSync(defaultEnvTest) ? defaultEnvTest : fallbackEnvTest);

  process.env.DOTENV_CONFIG_PATH = dotenvPath;
  dotenv.config({ path: dotenvPath, override: true, quiet: true });
}
