import { validatePassword, validateUsername } from "../user.service";

// Unit tests for password validation logic

describe("validateUsername", () => {
  it("validates valid usernames", () => {
    const tests = ["user123", "test_user", "user-name", "abc", "User123"];
    tests.forEach((username) => {
      expect(validateUsername(username).valid).toBe(true);
    });
  });

  it("rejects empty or whitespace-only usernames", () => {
    const result1 = validateUsername("");
    expect(result1.valid).toBe(false);
    expect(result1.message).toContain("required");

    const result2 = validateUsername("   ");
    expect(result2.valid).toBe(false);
    expect(result2.message).toContain("required");
  });

  it("rejects usernames shorter than 3 characters", () => {
    const result = validateUsername("ab");
    expect(result.valid).toBe(false);
    expect(result.message).toContain("at least 3 characters");
  });

  it("rejects usernames longer than 30 characters", () => {
    const result = validateUsername("a".repeat(31));
    expect(result.valid).toBe(false);
    expect(result.message).toContain("must not exceed 30 characters");
  });

  it("rejects usernames with invalid characters", () => {
    const invalidUsernames = [
      "user@name",
      "user name",
      "user.name",
      "user!name",
      "user#name",
      "user$name",
      "<script>alert('xss')</script>",
      "user'; DROP TABLE users--",
    ];
    invalidUsernames.forEach((username) => {
      const result = validateUsername(username);
      expect(result.valid).toBe(false);
      expect(result.message).toContain("can only contain");
    });
  });

  it("accepts usernames with underscores and hyphens", () => {
    const result1 = validateUsername("user_name");
    expect(result1.valid).toBe(true);

    const result2 = validateUsername("user-name");
    expect(result2.valid).toBe(true);

    const result3 = validateUsername("user_name-123");
    expect(result3.valid).toBe(true);
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
});
