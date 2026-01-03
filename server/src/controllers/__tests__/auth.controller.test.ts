import { changePassword, deleteUser } from "../auth.controller";
import { Request, Response } from "express";
import { AuthService } from "../../services/auth.service";

jest.mock("bcrypt");
jest.mock("../../repositories/auth.repository");
jest.mock("../../services/auth.service");

let mockRequest: Partial<Request> & { session?: any; body?: any };
let mockResponse: Partial<Response>;
let statusMock: jest.Mock;
let jsonMock: jest.Mock;
let clearCookieMock: jest.Mock;

beforeEach(() => {
  jsonMock = jest.fn();
  statusMock = jest.fn().mockReturnValue({ json: jsonMock });
  clearCookieMock = jest.fn();

  mockResponse = {
    status: statusMock,
    json: jsonMock,
    clearCookie: clearCookieMock,
  };
});
describe("changePassword", () => {
  it("returns 401 if user is not authenticated", async () => {
    mockRequest = { session: {} } as any;

    await changePassword(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Nicht authentifiziert!",
    });
  });

  it("returns 400 if required data is missing", async () => {
    mockRequest = {
      session: { user: { id: 1, username: "test" } },
      body: {},
    } as any;

    await changePassword(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Unvollständige Daten",
    });
  });
});

describe("deleteUser", () => {
  it("returns 401 if user is not authenticated", async () => {
    mockRequest = { session: {} } as any;

    await deleteUser(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Nicht authentifiziert",
    });
  });

  it("destroys session and clears cookie", async () => {
    const destroyMock = jest.fn((cb) => cb());

    (AuthService.deleteUser as jest.Mock).mockResolvedValue(undefined);

    mockRequest = {
      session: {
        user: { id: 1 },
        destroy: destroyMock,
      },
    } as any;

    await deleteUser(mockRequest as Request, mockResponse as Response);

    expect(AuthService.deleteUser).toHaveBeenCalledWith(1);
    expect(destroyMock).toHaveBeenCalled();
    expect(clearCookieMock).toHaveBeenCalledWith("connect.sid");
    expect(statusMock).toHaveBeenCalledWith(200);
  });
});
