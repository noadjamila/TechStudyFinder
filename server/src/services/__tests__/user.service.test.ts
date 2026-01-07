import { validatePassword, registerUser, AppError } from "../user.service";
import * as usersRepository from "../../repositories/users.repository";

// Unit tests for password validation logic

describe("validatePassword", () => {
  it("validates strong passwords", () => {
    const tests = ["Password123!", "MySecure@Pass99", "Test1234#Secure"];
    tests.forEach((password) => {
      expect(validatePassword(password).valid).toBe(true);
    });
  });

  it("rejects passwords shorter than 8 characters", () => {
    const result = validatePassword("Pass1!");
    expect(result.valid).toBe(false);
    expect(result.message).toContain("mindestens 8 Zeichen");
  });

  it("rejects passwords without letters", () => {
    const result = validatePassword("12345678!");
    expect(result.valid).toBe(false);
    expect(result.message).toContain("Buchstaben");
  });

  it("rejects passwords without numbers", () => {
    const result = validatePassword("Password!");
    expect(result.valid).toBe(false);
    expect(result.message).toContain("Zahl");
  });

  it("rejects passwords without special characters", () => {
    const result = validatePassword("Password123");
    expect(result.valid).toBe(false);
    expect(result.message).toContain("Sonderzeichen");
  });
});

// Unit tests for registerUser function
describe("registerUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects when user already exists", async () => {
    const existingUser = { id: 1, username: "testuser", password_hash: "hash" };
    jest
      .spyOn(usersRepository, "findByUsername")
      .mockResolvedValue(existingUser as any);

    try {
      await registerUser("testuser", "Password123!");
      fail("Should have thrown AppError");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).status).toBe(409);
      expect((error as AppError).message).toBe("username already in use");
    }
  });

  it("creates a new user with hashed password", async () => {
    const mockUser = {
      id: 1,
      username: "newuser",
      password_hash: "$2b$12$hashedpassword",
      created_at: new Date(),
    };

    jest.spyOn(usersRepository, "findByUsername").mockResolvedValueOnce(null);
    jest
      .spyOn(usersRepository, "createUser")
      .mockResolvedValueOnce(mockUser as any);

    const result = await registerUser("newuser", "Password123!");

    expect(result).toEqual({
      id: 1,
      username: "newuser",
      created_at: mockUser.created_at,
    });
  });

  it("returns user without exposing password hash", async () => {
    const mockUser = {
      id: 1,
      username: "testuser",
      password_hash: "$2b$12$hashedpassword",
      created_at: new Date(),
    };

    jest.spyOn(usersRepository, "findByUsername").mockResolvedValueOnce(null);
    jest
      .spyOn(usersRepository, "createUser")
      .mockResolvedValueOnce(mockUser as any);

    const result = await registerUser("testuser", "Password123!");

    // Verify result is of type PublicUser (no password_hash)
    expect(result).toEqual({
      id: 1,
      username: "testuser",
      created_at: mockUser.created_at,
    });
    expect(Object.keys(result)).not.toContain("password_hash");
  });

  it("calls createUser with username and hashed password", async () => {
    const mockUser = {
      id: 1,
      username: "testuser",
      password_hash: "$2b$12$hashedpassword",
      created_at: new Date(),
    };

    jest.spyOn(usersRepository, "findByUsername").mockResolvedValueOnce(null);
    const createUserSpy = jest
      .spyOn(usersRepository, "createUser")
      .mockResolvedValueOnce(mockUser as any);

    await registerUser("testuser", "Password123!");

    expect(createUserSpy).toHaveBeenCalledWith("testuser", expect.any(String));
    const [, passwordHash] = createUserSpy.mock.calls[0];
    expect(passwordHash).not.toBe("Password123!");
  });
});
