import bcrypt from "bcrypt";
import { AuthService } from "../auth.service";
import {
  findUserByUsername,
  updatePasswordById,
} from "../../repositories/auth.repository";

jest.mock("bcrypt");
jest.mock("../../repositories/auth.repository");

describe("AuthService.changePassword", () => {
  it("throws if user is not found", async () => {
    (findUserByUsername as jest.Mock).mockResolvedValue(null);

    await expect(
      AuthService.changePassword(1, "test", "old", "new"),
    ).rejects.toThrow("USER_NOT_FOUND");
  });

  it("throws if current password is wrong", async () => {
    (findUserByUsername as jest.Mock).mockResolvedValue({
      password_hash: "hash",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      AuthService.changePassword(1, "test", "wrong", "new"),
    ).rejects.toThrow("INVALID_PASSWORD");
  });

  it("updates password successfully", async () => {
    (findUserByUsername as jest.Mock).mockResolvedValue({
      password_hash: "oldHash",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (bcrypt.hash as jest.Mock).mockResolvedValue("newHash");

    await AuthService.changePassword(1, "test", "old", "new");

    expect(updatePasswordById).toHaveBeenCalledWith(1, "newHash");
  });
});
