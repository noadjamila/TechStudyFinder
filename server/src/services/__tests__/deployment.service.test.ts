import { Buffer } from "buffer";
import * as crypto from "crypto";
import { RawBodyRequest } from "../../types/deployment.types";
import { Response } from "express";
import * as rawBodyMiddleware from "../rawBody.utils";
import * as deploymentUtils from "../deployment.utils";
import { handleDeployWebhook, verifySignature } from "../deployment.service";
import * as deploymentService from "../deployment.service";

jest.mock("../rawBody.utils");
jest.mock("../deployment.utils");

const mockGetRawBody = rawBodyMiddleware.getRawBody as jest.Mock;
const mockRunDeploymentScript =
  deploymentUtils.runDeploymentScript as unknown as jest.Mock<
    Promise<void>,
    []
  >;
const MOCK_SECRET = "mock-secret";
const MOCK_RAW_BODY = Buffer.from('{"ref": "refs/heads/main", "after": "sha"}');
const calculatedHash = crypto
  .createHmac("sha256", MOCK_SECRET)
  .update(MOCK_RAW_BODY)
  .digest("hex");
const MOCK_HASH = `sha256=${calculatedHash}`;

let mockVerifySignature: jest.Mock;

const createMockRequest = (
  signature?: string,
  body: any = { ref: "refs/heads/main" },
  event: string = "push",
): RawBodyRequest => {
  return {
    headers: {
      "x-hub-signature-256": signature,
      "x-github-event": event,
    },
    body,
    rawBody: MOCK_RAW_BODY,
  } as unknown as RawBodyRequest;
};

const mockRes = () =>
  ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  }) as unknown as Response;

beforeAll(() => {
  mockVerifySignature = jest.spyOn(
    deploymentService,
    "verifySignature",
  ) as unknown as jest.Mock;
});

beforeEach(() => {
  process.env.GITHUB_WEBHOOK_SECRET = MOCK_SECRET;
  mockGetRawBody.mockReturnValue(MOCK_RAW_BODY);
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  mockVerifySignature.mockRestore();
  delete process.env.GITHUB_WEBHOOK_SECRET;
});

describe("verifySignature", () => {
  beforeEach(() => {
    mockVerifySignature.mockRestore();
  });
  afterEach(() => {
    mockVerifySignature = jest.spyOn(
      deploymentService,
      "verifySignature",
    ) as unknown as jest.Mock;
    jest.clearAllMocks();
  });

  it("should return true for a valid signature", () => {
    const isValid = verifySignature(MOCK_SECRET, MOCK_RAW_BODY, MOCK_HASH);
    expect(isValid).toBe(true);
  });

  it("should return false if GITHUB_WEBHOOK_SECRET is missing", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const isValid = verifySignature("", MOCK_RAW_BODY, MOCK_HASH);

    expect(isValid).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it("should return false for an algorithm that is not SHA-256", () => {
    const consoleWarnSpy = jest
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    const invalidAlgorithm = "invalidalgo=some-algorithm";

    const isValid = verifySignature(
      MOCK_SECRET,
      MOCK_RAW_BODY,
      invalidAlgorithm,
    );

    expect(isValid).toBe(false);
    expect(consoleWarnSpy).toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
  });
});

describe("handleDeployWebhook", () => {
  beforeEach(() => {
    mockGetRawBody.mockReturnValue(MOCK_RAW_BODY);
    mockRunDeploymentScript.mockResolvedValue(undefined);
    mockVerifySignature.mockReturnValue(true);
  });

  it("should return status 200 and perform deployment for valid push to main", async () => {
    const req = createMockRequest(MOCK_HASH);
    const res = mockRes();

    await handleDeployWebhook(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Deployment finished" });
    expect(mockRunDeploymentScript).toHaveBeenCalled();
  });

  it("should return status 400 if the signature is missing", async () => {
    const consoleWarnSpy = jest
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    const req = createMockRequest(undefined);
    const res = mockRes();

    (req as { rawBody: Buffer | undefined }).rawBody = undefined;

    await handleDeployWebhook(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing signature" });
    expect(mockRunDeploymentScript).not.toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
  });

  it("should return status 401 if the signature verification fails", async () => {
    const consoleWarnSpy = jest
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    mockVerifySignature.mockReturnValueOnce(false);

    const invalidSignature =
      "sha256=ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    const req = createMockRequest(invalidSignature);
    const res = mockRes();

    await handleDeployWebhook(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
    expect(mockRunDeploymentScript).not.toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
  });

  it("should return status 200 and not deploy if the GitHub event is not `push`", async () => {
    const req = createMockRequest(
      MOCK_HASH,
      { ref: "refs/heads/main" },
      "pull_request",
    );
    const res = mockRes();

    await handleDeployWebhook(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "No deployment needed" });
    expect(mockRunDeploymentScript).not.toHaveBeenCalled();
  });

  it("should return status 200 and not deploy when pushing on non-main branch", async () => {
    const req = createMockRequest(
      MOCK_HASH,
      { ref: "refs/heads/some-branch" },
      "push",
    );
    const res = mockRes();

    await handleDeployWebhook(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "No deployment needed" });
    expect(mockRunDeploymentScript).not.toHaveBeenCalled();
  });
});
