import { exec } from "child_process";

/**
 * Executes the deployment shell script.
 * @returns Promise that resolves when the script execution is complete.
 */
export function runDeploymentScript(): Promise<void> {
  const SCRIPT_PATH = "./deploy.sh";

  return new Promise((resolve, reject) => {
    exec(`sh ${SCRIPT_PATH}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`[Deployment Script] Error: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`[Deployment Script] Stderr: ${stderr}`);
      }
      console.log(`[Deployment Script] Deployment successful: ${stdout}`);
      resolve();
    });
  });
}
