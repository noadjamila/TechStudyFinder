import { getRawBody } from '../middlewares/rawBody.middleware';
import * as crypto from 'crypto';
import { Buffer } from 'buffer';

export const handleDeployWebhook = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const rawBody = getRawBody(req);

    /*
    * Perform security check
    */
    if (!verifySignature(req.headers['x-hub-signature-256'] as string, rawBody)) {
        console.warn('Webhook signature verification failed');
        return res.status(401).json({ error: 'Unauthorized' });
    }

      /*
       * Validate event type and branch
       */
      const githubEvent = req.headers['x-github-event'];
      const branch = req.body.ref;

      if (githubEvent !== "push" || branch !== 'refs/heads/main') {
        return res.status(200).json({ message: 'No deployment needed' });
    }

      res.status(200).json({ message: 'Webhook received, deployment started' });

      try {
        await runDeploymentScript();
      } catch (error) {
        console.error('Deployment script failed:', error);
      }
};

/**
 * Check the GitHub webhook signature
 * @param signature The signature from the webhook header 'x-hub-signature-256'
 * @param rawBody The raw request body
 * @returns boolean indicating if the signature is valid
 */
const verifySignature = (signature: string, rawBody: Buffer): boolean {
  if (!signature || !GITHUB_WEBHOOK_SECRET) {
    return false;
  }

  const [algorithm, githubHash] = signature.split("=");
  if (algorithm !== 'sha256') {
      console.warn('[verifySignature] Unknown signature algorithm:', algorithm);
    return false;
  }

  const hmac = crypto.createHmac(algorithm, GITHUB_WEBHOOK_SECRET);
  hmac.update(rawBody);
  const calculatedHash = hmac.digest('hex');

  const calculatedHashBuffer = Buffer.from(calculatedHash, 'hex');
  const githubHashBuffer = Buffer.from(githubHash, 'hex');

  if (calculatedHashBuffer.length !== githubHashBuffer.length) {
    return false;
  }

    return crypto.timingSafeEqual(calculatedHashBuffer, githubHashBuffer);
};
