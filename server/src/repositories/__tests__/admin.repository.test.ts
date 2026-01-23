import {
  getRiasecData,
  updateRiasecData,
  findAdminForLogin,
} from "../admin.repository";
import { pool } from "../../../db";
import { RiasecUpdate } from "../../types/riasecScores";
import bcrypt from "bcrypt";

jest.mock("../../../db", () => ({
  pool: { query: jest.fn() },
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

const mockQuery = pool.query as jest.Mock;
const mockCompare = bcrypt.compare as jest.Mock;

describe("getRiasecData", () => {
  it("should fetch all three tables and return combined object", async () => {
    const mockStudienfelder = { rows: [{ id: 1, name: "SF1", r: 5 }] };
    const mockStudiengebiete = { rows: [{ id: 1, name: "SG1", R: 3 }] };
    const mockStudiengaenge = { rows: [{ id: 1, name: "SGANG1", R: 2 }] };

    (pool.query as jest.Mock)
      .mockResolvedValueOnce(mockStudienfelder)
      .mockResolvedValueOnce(mockStudiengebiete)
      .mockResolvedValueOnce(mockStudiengaenge);

    const result = await getRiasecData();

    expect(result).toEqual({
      studienfelder: mockStudienfelder.rows,
      studiengebiete: mockStudiengebiete.rows,
      studiengaenge: mockStudiengaenge.rows,
    });

    expect(pool.query).toHaveBeenCalledTimes(3);
  });

  it("should throw if a query fails", async () => {
    const error = new Error("DB failure");
    (pool.query as jest.Mock).mockRejectedValueOnce(error);

    await expect(getRiasecData()).rejects.toThrow("DB failure");
  });
});

describe("updateRiasecData", () => {
  it("should generate correct UPDATE query and call pool.query", async () => {
    (pool.query as jest.Mock).mockResolvedValue(undefined);

    const updates = {
      table: "studienfelder",
      id: 1,
      changes: { R: 5, I: 4 },
    } as RiasecUpdate;

    await updateRiasecData(updates);

    expect(pool.query).toHaveBeenCalledTimes(1);
    const [query, values] = (pool.query as jest.Mock).mock.calls[0];

    expect(query).toContain("UPDATE studienfelder");
    expect(query).toContain("riasec_override_r = $1");
    expect(query).toContain("riasec_override_i = $2");
    expect(values).toEqual([5, 4, 1]);
  });

  it("should do nothing if no changes provided", async () => {
    const updates = {
      table: "studienfelder",
      id: 1,
      changes: {},
    } as RiasecUpdate;

    await updateRiasecData(updates);

    expect(pool.query).toHaveBeenCalledTimes(0);
  });

  it("should skip unknown keys and update valid ones", async () => {
    (pool.query as jest.Mock).mockResolvedValue(undefined);

    const updates = {
      table: "studiengebiete",
      id: 2,
      changes: { R: 3, X: 10 },
    } as RiasecUpdate;

    await updateRiasecData(updates);

    const [query, values] = (pool.query as jest.Mock).mock.calls[0];
    expect(query).toContain("UPDATE studiengebiete");
    expect(query).toContain("riasec_r = $1");
    expect(values).toEqual([3, 2]);
  });
});

describe("findUserForLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns user when bcrypt validates successfully", async () => {
    const dbUser = { id: 2, adminname: "dbUser", password_hash: "hash" };

    mockQuery.mockResolvedValueOnce({
      rows: [dbUser], // findUserByUsername returns the user
    });
    mockCompare.mockResolvedValueOnce(true);

    const user = await findAdminForLogin("dbUser", "secret");

    expect(user).toEqual({ id: 2, adminname: "dbUser" });
    expect(mockCompare).toHaveBeenCalledWith("secret", "hash");
  });

  it("returns null when bcrypt fails", async () => {
    const dbUser = { id: 2, username: "dbUser", password_hash: "hash" };

    mockQuery.mockResolvedValueOnce({
      rows: [dbUser], // findUserByUsername returns the user
    });
    mockCompare.mockResolvedValueOnce(false);

    const user = await findAdminForLogin("dbUser", "wrong");

    expect(user).toBeNull();
    expect(mockCompare).toHaveBeenCalledWith("wrong", "hash");
  });
});
