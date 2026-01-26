import {
  processUploadFiles,
  handleGetRiasecData,
  handleEditRiasecData,
  handleLogin,
} from "../admin.service";
import { initializeDatabaseWithUpload } from "../../../db/scripts/init_data_with_upload";
import {
  getRiasecData,
  updateRiasecData,
  findAdminForLogin,
} from "../../repositories/admin.repository";
import { RiasecUpdate } from "../../types/riasecScores";

jest.mock("../../../db/scripts/init_data_with_upload", () => ({
  initializeDatabaseWithUpload: jest.fn(),
}));

jest.mock("../../repositories/admin.repository", () => ({
  getRiasecData: jest.fn(),
  updateRiasecData: jest.fn(),
  findAdminForLogin: jest.fn(),
}));

describe("processUploadFiles", () => {
  const validXml = "<root><test /></root>";
  const invalidXml = "not-xml";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize database with valid XML files", async () => {
    await processUploadFiles({
      institutionsXml: validXml,
      degreeprogrammesXml: validXml,
    });

    expect(initializeDatabaseWithUpload).toHaveBeenCalledTimes(1);
    expect(initializeDatabaseWithUpload).toHaveBeenCalledWith(
      validXml,
      validXml,
    );
  });

  it("should throw error for invalid XML format", async () => {
    await expect(
      processUploadFiles({
        institutionsXml: invalidXml,
        degreeprogrammesXml: validXml,
      }),
    ).rejects.toThrow("INVALID_XML_FORMAT");

    expect(initializeDatabaseWithUpload).not.toHaveBeenCalled();
  });

  it("should propagate database errors", async () => {
    (initializeDatabaseWithUpload as jest.Mock).mockRejectedValue(
      new Error("database error"),
    );

    await expect(
      processUploadFiles({
        institutionsXml: validXml,
        degreeprogrammesXml: validXml,
      }),
    ).rejects.toThrow("database error");
  });
});

describe("handleGetRiasecData", () => {
  it("should return data when getRiasecData succeeds", async () => {
    const mockData = [
      { id: 1, name: "TestStudiengebiet" },
      { id: 2, name: "TestStudienfeld" },
    ];
    (getRiasecData as jest.Mock).mockResolvedValue(mockData);

    const result = await handleGetRiasecData();
    expect(result).toEqual(mockData);
    expect(getRiasecData).toHaveBeenCalledTimes(1);
  });

  it("should throw an error when getRiasecData fails", async () => {
    const mockError = new Error("DB error");
    (getRiasecData as jest.Mock).mockRejectedValue(mockError);

    await expect(handleGetRiasecData()).rejects.toThrow("DB error");
  });
});

describe("handleEditRiasecData", () => {
  it("should call updateRiasecData with the correct parameters", async () => {
    const updates = {
      table: "studiengebiete",
      id: 1,
      changes: { r: 2 },
    } as RiasecUpdate;
    (updateRiasecData as jest.Mock).mockResolvedValue(undefined);

    await handleEditRiasecData(updates);
    expect(updateRiasecData).toHaveBeenCalledWith(updates);
  });

  it("should throw an error if updateRiasecData fails", async () => {
    const updates = {
      table: "studiengebiete",
      id: 1,
      changes: { r: 2 },
    } as RiasecUpdate;
    const mockError = new Error("Update failed");
    (updateRiasecData as jest.Mock).mockRejectedValue(mockError);

    await expect(handleEditRiasecData(updates)).rejects.toThrow(
      "Update failed",
    );
  });
});

describe("login", () => {
  it("returns user if credentials are valid", async () => {
    const mockUser = { id: 1, username: "test" };

    (findAdminForLogin as jest.Mock).mockResolvedValue(mockUser);

    const result = await handleLogin("test", "password");

    expect(findAdminForLogin).toHaveBeenCalledWith("test", "password");
    expect(result).toEqual(mockUser);
  });

  it("throws error if user is not found", async () => {
    (findAdminForLogin as jest.Mock).mockResolvedValue(null);

    await expect(handleLogin("test", "wrongpassword")).rejects.toThrow(
      "INVALID",
    );
  });
});
