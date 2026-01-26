import { validatePassword, validateUsername } from "../credentialsValidation";
import "@testing-library/jest-dom";

describe("validatePassword", () => {
  it("returns invalid if password is empty", () => {
    const result = validatePassword("");
    expect(result.valid).toBe(false);
    expect(result.message).toBe(
      "Passwort muss mindestens 8 Zeichen lang sein.",
    );
  });

  it("returns invalid if password is shorter than 8 characters", () => {
    const result = validatePassword("Ab1$xyz");
    expect(result.valid).toBe(false);
    expect(result.message).toBe(
      "Passwort muss mindestens 8 Zeichen lang sein.",
    );
  });

  it("returns invalid if password is longer than 72 characters", () => {
    const longPassword = "A1$".repeat(25); // 75 chars
    const result = validatePassword(longPassword);
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Passwort darf maximal 72 Zeichen lang sein.");
  });

  it("returns invalid if password has no letters", () => {
    const result = validatePassword("1234$5678");
    expect(result.valid).toBe(false);
    expect(result.message).toBe(
      "Passwort muss mindestens einen Buchstaben enthalten.",
    );
  });

  it("returns invalid if password has no numbers", () => {
    const result = validatePassword("Abcdef$gh");
    expect(result.valid).toBe(false);
    expect(result.message).toBe(
      "Passwort muss mindestens eine Zahl enthalten.",
    );
  });

  it("returns invalid if password has no special characters", () => {
    const result = validatePassword("Abcd1234");
    expect(result.valid).toBe(false);
    expect(result.message).toBe(
      "Passwort muss mindestens ein Sonderzeichen enthalten.",
    );
  });

  it("returns valid for a password that meets all criteria", () => {
    const result = validatePassword("Abcd1234$");
    expect(result.valid).toBe(true);
    expect(result.message).toBeUndefined();
  });
});

describe("validateUsername", () => {
  it("returns invalid if username is empty", () => {
    const result = validateUsername("");
    expect(result.valid).toBe(false);
    expect(result.message).toBe(
      "Username muss mindestens 5 Zeichen lang sein.",
    );
  });

  it("returns invalid if username is shorter than 5 characters", () => {
    const result = validateUsername("AA");
    expect(result.valid).toBe(false);
    expect(result.message).toBe(
      "Username muss mindestens 5 Zeichen lang sein.",
    );
  });

  it("returns valid for a username that meets all criteria", () => {
    const result = validateUsername("Abcde");
    expect(result.valid).toBe(true);
    expect(result.message).toBeUndefined();
  });
});
