import { validateUsername, validatePassword } from "../user.service";

// Unit tests for username validation logic

describe("validateUsername", () => {
  it("validates strong usernames", () => {
    const validUsernames = [
      "user123",
      "test_user",
      "admin-user",
      "a1b2c",
      "User123",
    ];
    validUsernames.forEach((username) => {
      const result = validateUsername(username);
      expect(result.valid).toBe(true);
    });
  });

  it("rejects usernames shorter than 5 characters", () => {
    const result = validateUsername("test");
    expect(result.valid).toBe(false);
    expect(result.message).toContain("at least 5 characters");
  });

  it("rejects usernames longer than 30 characters", () => {
    const longUsername = "a".repeat(31);
    const result = validateUsername(longUsername);
    expect(result.valid).toBe(false);
    expect(result.message).toContain("at most 30 characters");
  });

  it("rejects usernames starting with underscore", () => {
    const result = validateUsername("_user123");
    expect(result.valid).toBe(false);
    expect(result.message).toContain("start and end with alphanumeric");
  });

  it("rejects usernames starting with hyphen", () => {
    const result = validateUsername("-user123");
    expect(result.valid).toBe(false);
    expect(result.message).toContain("start and end with alphanumeric");
  });

  it("rejects usernames ending with underscore", () => {
    const result = validateUsername("user123_");
    expect(result.valid).toBe(false);
    expect(result.message).toContain("start and end with alphanumeric");
  });

  it("rejects usernames ending with hyphen", () => {
    const result = validateUsername("user123-");
    expect(result.valid).toBe(false);
    expect(result.message).toContain("start and end with alphanumeric");
  });

  it("rejects usernames with invalid characters", () => {
    const invalidUsernames = [
      "user@123",
      "user#123",
      "user$123",
      "user 123",
      "user.123",
      "<script>",
    ];
    invalidUsernames.forEach((username) => {
      const result = validateUsername(username);
      expect(result.valid).toBe(false);
    });
  });

  it("blocks SQL injection patterns", () => {
    const result = validateUsername("admin'; DROP TABLE--");
    expect(result.valid).toBe(false);
  });

  it("blocks XSS patterns", () => {
    const result = validateUsername("<script>alert('xss')</script>");
    expect(result.valid).toBe(false);
  });

  it("blocks confusing patterns", () => {
    expect(validateUsername("__admin").valid).toBe(false);
    expect(validateUsername("--user").valid).toBe(false);
  });
});

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
    expect(result.message).toContain("at least 8 characters");
  });

  it("rejects passwords without letters", () => {
    const result = validatePassword("12345678!");
    expect(result.valid).toBe(false);
    expect(result.message).toContain("at least one letter");
  });

  it("rejects passwords without numbers", () => {
    const result = validatePassword("Password!");
    expect(result.valid).toBe(false);
    expect(result.message).toContain("at least one number");
  });

  it("rejects passwords without special characters", () => {
    const result = validatePassword("Password123");
    expect(result.valid).toBe(false);
    expect(result.message).toContain("at least one special character");
  });

  it("rejects passwords longer than 72 characters", () => {
    const longPassword = "Pass1!".repeat(15); // 90 chars
    const result = validatePassword(longPassword);
    expect(result.valid).toBe(false);
    expect(result.message).toContain("at most 72 characters");
  });
});
