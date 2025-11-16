import { execFile } from "child_process";
import * as path from "path";

/**
 * Executes the deployment shell script.
 * @returns Promise that resolves when the script execution is complete.
 */
export function runDeploymentScript(): Promise<void> {
  const SCRIPT_PATH = process.env.DEPLOYMENT_SCRIPT_PATH
    ? path.resolve(process.env.DEPLOYMENT_SCRIPT_PATH)
    : path.resolve(process.cwd(), "deploy.sh");
  const DEPLOYMENT_TIMEOUT_MS = 300000;

  return new Promise((resolve, reject) => {
    execFile(
      SCRIPT_PATH,
      { timeout: DEPLOYMENT_TIMEOUT_MS },
      (error, stdout, stderr) => {
        if (error) {
          console.error(`[Deployment Script] Error: ${error.message}`);
          return reject(error);
        }
        if (stderr) {
          console.error(`[Deployment Script] Stderr: ${stderr}`);
        }
        console.log(`[Deployment Script] Deployment successful: ${stdout}`);
        resolve();
      },
    );
  });
}
