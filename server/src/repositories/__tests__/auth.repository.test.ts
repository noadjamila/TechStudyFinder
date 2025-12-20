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
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 2, username: "dbUser", password_hash: "hash" }],
    });
    mockCompare.mockResolvedValueOnce(true);

    const user = await findUserForLogin("dbUser", "secret");

    expect(user).toEqual({ id: 2, username: "dbUser" });
  });

  it("returns null when bcrypt fails", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 2, username: "dbUser", password_hash: "hash" }],
    });
    mockCompare.mockResolvedValueOnce(false);

    const user = await findUserForLogin("dbUser", "wrong");

    expect(user).toBeNull();
  });
});
