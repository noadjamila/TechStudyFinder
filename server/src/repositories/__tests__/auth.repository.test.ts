import { findUserForLogin, findUserByUsername } from "../auth.repository";
import bcrypt from "bcrypt";
import { pool } from "../../../db";

jest.mock("../../../db", () => ({
  pool: {
    query: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

describe("findUserByUsername", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns user when bcrypt validates successfully based on username", async () => {
    (pool.query as jest.Mock).mockResolvedValue({
      rows: [{ id: 2, username: "dbUser", password_hash: "hash" }],
    });
    (bcrypt.compare as jest.Mock).mockReturnValueOnce(true);

    const user = await findUserByUsername("dbUser", "secret");
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT id, username, password_hash FROM users WHERE username = $1",
      ["dbUser"],
    );

    expect(user).toEqual({ id: 2, username: "dbUser" });
  });

  it("returns null when bcrypt fails", async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rows: [{ id: 3, username: "dbUser", password_hash: "hash" }],
    });
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    const user = await findUserForLogin("dbUser", "wrong");
    expect(user).toBeNull();
  });
});
