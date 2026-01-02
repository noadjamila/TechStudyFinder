import bcrypt from "bcrypt";
import { changePassword, deleteUser } from "../auth.controller";
import { Request, Response } from "express";
import {
  deleteUserById,
  findUserByUsername,
  updatePasswordById,
} from "../../repositories/auth.repository";

jest.mock("bcrypt");
jest.mock("../../repositories/auth.repository");

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

  it("returns 404 if user is not found", async () => {
    (findUserByUsername as jest.Mock).mockResolvedValue(null);

    mockRequest = {
      session: { user: { id: 1, username: "test" } },
      body: { currentPassword: "old", newPassword: "new" },
    } as any;

    await changePassword(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
  });

  it("returns 403 if current password is incorrect", async () => {
    (findUserByUsername as jest.Mock).mockResolvedValue({
      password_hash: "hash",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    mockRequest = {
      session: { user: { id: 1, username: "test" } },
      body: { currentPassword: "wrong", newPassword: "new" },
    } as any;

    await changePassword(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Das eingegebene aktuelle Passwort ist nicht korrekt.",
    });
  });

  it("updates password successfully", async () => {
    (findUserByUsername as jest.Mock).mockResolvedValue({
      password_hash: "oldHash",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (bcrypt.hash as jest.Mock).mockResolvedValue("newHash");

    mockRequest = {
      session: { user: { id: 1, username: "test" } },
      body: { currentPassword: "old", newPassword: "new" },
    } as any;

    await changePassword(mockRequest as Request, mockResponse as Response);

    expect(updatePasswordById).toHaveBeenCalledWith(1, "newHash");
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Passwort erfolgreich geändert",
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

  it("deletes user, destroys session and clears cookie", async () => {
    const destroyMock = jest.fn((cb) => cb());

    (deleteUserById as jest.Mock).mockResolvedValue(undefined);

    mockRequest = {
      session: {
        user: { id: 1 },
        destroy: destroyMock,
      },
    } as any;

    await deleteUser(mockRequest as Request, mockResponse as Response);

    expect(deleteUserById).toHaveBeenCalledWith(1);
    expect(destroyMock).toHaveBeenCalled();
    expect(clearCookieMock).toHaveBeenCalledWith("connect.sid");
    expect(statusMock).toHaveBeenCalledWith(200);
  });
});
