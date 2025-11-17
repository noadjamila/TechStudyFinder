import { afterAll, beforeEach, describe, it } from "@jest/globals";

const MOCK_SECRET = "test-secret-for-env";
process.env.GITHUB_WEBHOOK_SECRET = MOCK_SECRET;

import request, { Response, Test } from "supertest";
import app, { server, pool } from "../../../index";

const TIMEOUT_MS = 180000;

jest.setTimeout(200000);
jest.useRealTimers();

jest.mock("../../../db");
jest.mock("../deployment.utils", () => ({
  runDeploymentScript: jest.fn(() => Promise.resolve()),
}));

var mockHandleDeployWebhook = jest.fn(() => Promise.resolve());
var mockVerifySignature = jest.fn(() => true);

jest.mock("../deployment.service", () => {
  return {
    get handleDeployWebhook() {
      return mockHandleDeployWebhook;
    },
    get verifySignature() {
      return mockVerifySignature;
    },
  };
});

const supertestEnd = (request: Test): Promise<Response> => {
  return new Promise<Response>((resolve, reject) => {
    request.end((err: any, res: Response) => {
      if (err) {
        return reject(err);
      }
      resolve(res);
    });
  });
};

afterAll(async () => {
  delete process.env.GITHUB_WEBHOOK_SECRET;

  if (server) {
    await new Promise<void>((resolve) => {
      server?.close(() => {
        resolve();
      });
    });
  }

  await pool.end();
}, TIMEOUT_MS);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("integration test POST /deploy/webhook", () => {
  it("should return 200 when deployment is successful", async () => {
    mockVerifySignature.mockReturnValueOnce(true);

    const payload = {
      ref: "refs/heads/main",
    };

    const req = request(app)
      .post("/deploy/webhook")
      .send(payload)
      .set("X-GitHub-Event", "push")
      .set("X-Hub-Signature-256", "sha256=MOCK_VALID_SIGNATURE")
      .expect(200);

    await supertestEnd(req);

    expect(
      require("../deployment.utils").runDeploymentScript,
    ).toHaveBeenCalled();
  });

  it("should return 401 when the signature check fails", async () => {
    mockVerifySignature.mockReturnValueOnce(false);

    const payload = { ref: "refs/heads/main" };

    const req = request(app)
      .post("/deploy/webhook")
      .send(payload)
      .set("X-GitHub-Event", "push")
      .set("X-Hub-Signature-256", "sha256=MOCK_VALID_SIGNATURE")
      .expect(401);

    await supertestEnd(req);

    expect(
      require("../deployment.utils").runDeploymentScript,
    ).not.toHaveBeenCalled();
  });
});
