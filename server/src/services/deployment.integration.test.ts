import request, { Response, Test } from "supertest";
import app, { server } from "../../index";
import {
  jest,
  afterAll,
  beforeEach,
  describe,
  it,
  expect,
} from "@jest/globals";

jest.mock("../../db");
jest.mock("./deployment.utils", () => ({
  runDeploymentScript: jest.fn(() => Promise.resolve()),
}));
jest.mock("./deployment.service", () => ({
  handleDeployWebhook: jest.fn(() => Promise.resolve()),
  verifySignature: jest.fn(() => true),
}));

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
  if (server) {
    await new Promise<void>((resolve) => {
      server?.close(() => {
        resolve();
      });
    });
  }
}, 10000);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("integration test POST /deploy/webhook", () => {
  it("should return 200 when deployment is successful", async () => {
    require("./deployment.service").verifySignature.mockReturnValueOnce(true);

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
      require("./deployment.utils").runDeploymentScript,
    ).toHaveBeenCalled();
  }, 1000);

  it("should return 401 when the signature check fails", async () => {
    require("./deployment.service").verifySignature.mockReturnValueOnce(false);

    const payload = { ref: "refs/heads/main" };

    const req = request(app)
      .post("/deploy/webhook")
      .send(payload)
      .set("X-GitHub-Event", "push")
      .set("X-Hub-Signature-256", "sha256=MOCK_VALID_SIGNATURE")
      .expect(401);

    await supertestEnd(req);

    expect(
      require("./deployment.utils").runDeploymentScript,
    ).not.toHaveBeenCalled();
  }, 10000);
});
