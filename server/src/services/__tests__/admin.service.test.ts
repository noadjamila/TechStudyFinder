import { processUploadFiles } from "../admin.service";
import { initializeDatabaseWithUpload } from "../../../db/scripts/init_data_with_upload";

jest.mock("../../../db/scripts/init_data_with_upload", () => ({
  initializeDatabaseWithUpload: jest.fn(),
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
