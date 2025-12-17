import { validatePassword } from "../user.service";

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
