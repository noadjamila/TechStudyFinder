import bcrypt from "bcrypt";
import { pool } from "../../../db";
import { findUserForLogin } from "../auth.repository";

jest.mock("../../../db", () => ({
  pool: { query: jest.fn() },
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

const mockQuery = pool.query as jest.Mock;
const mockCompare = bcrypt.compare as jest.Mock;

describe("findUserForLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns user when bcrypt validates successfully", async () => {
    const dbUser = { id: 2, username: "dbUser", password_hash: "hash" };

    mockQuery.mockResolvedValueOnce({
      rows: [dbUser],
    });
    mockCompare.mockResolvedValueOnce(true);

    const user = await findUserForLogin("dbUser", "secret");

    expect(user).toEqual({ id: 2, username: "dbUser" });
    expect(mockCompare).toHaveBeenCalledWith("secret", "hash");
  });

  it("returns null when bcrypt fails", async () => {
    const dbUser = { id: 2, username: "dbUser", password_hash: "hash" };

    mockQuery.mockResolvedValueOnce({
      rows: [dbUser],
    });
    mockCompare.mockResolvedValueOnce(false);

    const user = await findUserForLogin("dbUser", "wrong");

    expect(user).toBeNull();
    expect(mockCompare).toHaveBeenCalledWith("wrong", "hash");
  });
});
