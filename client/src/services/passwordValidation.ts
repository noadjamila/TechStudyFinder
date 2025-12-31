/**
 * Validates the password based on security requirements
 * Password must be 8-72 characters with at least one letter, number, and special character
 * @param {string} password - The password to validate
 * @returns {{valid: boolean, message?: string}} Validation result with optional error message
 */
export function validatePassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (!password || password.length < 8) {
    return {
      valid: false,
      message: "Passwort muss mindestens 8 Zeichen lang sein.",
    };
  }
  if (password.length > 72) {
    return {
      valid: false,
      message: "Passwort darf maximal 72 Zeichen lang sein.",
    };
  }
  if (!/[A-Za-z]/.test(password)) {
    return {
      valid: false,
      message: "Passwort muss mindestens einen Buchstaben enthalten.",
    };
  }
  if (!/\d/.test(password)) {
    return {
      valid: false,
      message: "Passwort muss mindestens eine Zahl enthalten.",
    };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return {
      valid: false,
      message: "Passwort muss mindestens ein Sonderzeichen enthalten.",
    };
  }
  return { valid: true };
}
