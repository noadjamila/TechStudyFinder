import {
  changePassword,
  deleteUser,
  getUser,
  login,
  logout,
} from "../auth.controller";
import { Request, Response } from "express";
import { AuthService } from "../../services/auth.service";

jest.mock("bcrypt", () => ({
  hash: jest.fn(async () => "hashed_password"),
  compare: jest.fn(async () => true),
}));
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

describe("getUser", () => {
  it("returns 200 and a session user for valid credentials", async () => {
    mockRequest = { session: { user: { id: 1, username: "test" } } } as any;

    await getUser(mockRequest as Request, mockResponse as Response);

    expect(jsonMock).toHaveBeenCalledWith({
      id: 1,
      username: "test",
    });
  });

  it("returns 401 for invalid credentials", async () => {
    mockRequest = { session: {} } as any;

    await getUser(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Nicht authentifiziert!",
    });
  });
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

describe("login", () => {
  it("returns 400 for missing credentials", async () => {
    mockRequest = {
      body: {},
      session: {},
    } as any;

    await login(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Missing credentials",
    });
  });

  it("logs in successfully and sets session user", async () => {
    const mockUser = { id: 1, username: "testuser" };

    (AuthService.login as jest.Mock).mockResolvedValue(mockUser);

    mockRequest = {
      body: { username: "testuser", password: "password123!" },
      session: {},
    } as any;

    await login(mockRequest as Request, mockResponse as Response);

    expect(AuthService.login).toHaveBeenCalledWith("testuser", "password123!");

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Login successful",
      user: {
        id: 1,
        username: "testuser",
      },
    });
  });

  it("returns 401 if user is not found", async () => {
    (AuthService.login as jest.Mock).mockRejectedValue(
      new Error("USER_NOT_FOUND"),
    );

    mockRequest = {
      body: { username: "bad", password: "bad" },
      session: {},
    } as any;

    await login(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Invalid credentials",
    });
  });
});

describe("logout", () => {
  it("returns 500 if session destroy fails", async () => {
    const destroyMock = jest.fn((cb) => cb(new Error("destroy failed")));

    mockRequest = {
      session: {
        destroy: destroyMock,
      },
    } as any;

    await logout(mockRequest as Request, mockResponse as Response);

    expect(destroyMock).toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Logout failed",
    });
    expect(clearCookieMock).not.toHaveBeenCalled();
  });

  it("destroys session and clears cookie", async () => {
    const destroyMock = jest.fn((cb) => cb(null));

    mockRequest = {
      session: {
        destroy: destroyMock,
      },
    } as any;

    await logout(mockRequest as Request, mockResponse as Response);

    expect(destroyMock).toHaveBeenCalled();
    expect(clearCookieMock).toHaveBeenCalledWith("connect.sid");
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Logout successful",
    });
  });
});
