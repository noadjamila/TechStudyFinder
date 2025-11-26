import { handleWebhook } from "../../controllers/deploy.controller";
import { verifySignature } from "../../services/deployment.service";
import { runDeploymentScript } from "../../services/deployment.utils";

jest.mock("../../services/deployment.service");
jest.mock("../../services/deployment.utils");

describe("handleWebhook", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      headers: {},
      body: {},
      rawBody: Buffer.from("payload"),
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    process.env.GITHUB_WEBHOOK_SECRET = "secret";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if raw body is missing", async () => {
    req.rawBody = undefined;

    await handleWebhook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Missing raw body for verification",
    });
  });

  it("returns 400 if signature header is missing", async () => {
    req.headers["x-hub-signature-256"] = undefined;

    await handleWebhook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing signature" });
  });

  it("returns 200 if event is not a push", async () => {
    req.headers["x-hub-signature-256"] = "sig";
    req.headers["x-github-event"] = "issues";

    await handleWebhook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "No deployment needed" });
  });

  it("returns 500 if secret is missing", async () => {
    delete process.env.GITHUB_WEBHOOK_SECRET;

    req.headers["x-hub-signature-256"] = "sig";
    req.headers["x-github-event"] = "push";

    await handleWebhook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Server misconfiguration: GITHUB_WEBHOOK_SECRET is not set",
    });
  });

  it("returns 401 if signature verification fails", async () => {
    req.headers["x-hub-signature-256"] = "sig";
    req.headers["x-github-event"] = "push";
    (verifySignature as jest.Mock).mockReturnValue(false);

    await handleWebhook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  it("returns 400 if payload.ref is missing", async () => {
    req.headers["x-hub-signature-256"] = "sig";
    req.headers["x-github-event"] = "push";
    (verifySignature as jest.Mock).mockReturnValue(true);

    req.body = {};

    await handleWebhook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Malformed payload: missing or invalid 'ref'",
    });
  });

  it("returns 200 if branch is not main", async () => {
    req.headers["x-hub-signature-256"] = "sig";
    req.headers["x-github-event"] = "push";
    (verifySignature as jest.Mock).mockReturnValue(true);

    req.body = { ref: "refs/heads/feature" };

    await handleWebhook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "No deployment needed" });
  });

  it("starts deployment and immediately returns 200", async () => {
    req.rawBody = Buffer.from("payload");
    req.headers["x-hub-signature-256"] = "sig";
    req.headers["x-github-event"] = "push";

    (verifySignature as jest.Mock).mockReturnValue(true);

    req.body = { ref: "refs/heads/main" };

    await handleWebhook(req, res, next);

    expect(runDeploymentScript).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Deployment started" });
  });

  it("calls next(err) if an exception occurs", async () => {
    req.headers["x-hub-signature-256"] = "sig";
    req.headers["x-github-event"] = "push";
    (verifySignature as jest.Mock).mockImplementation(() => {
      throw new Error("Boom");
    });

    await handleWebhook(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
