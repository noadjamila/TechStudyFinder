import request from "supertest";
import express from "express";
import {
  uploadMiddleware,
  handleMulterError,
  uploadData,
  editRiasecData,
  getRiasecData,
} from "../admin.controller";
import {
  processUploadFiles,
  handleEditRiasecData,
  handleGetRiasecData,
} from "../../services/admin.service";

jest.mock("../../services/admin.service");

const app = express();

app.post("/upload-data", uploadMiddleware, handleMulterError, uploadData);

describe("Upload Controller", () => {
  const validXmlBuffer = Buffer.from("<root></root>");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 for valid upload", async () => {
    (processUploadFiles as jest.Mock).mockResolvedValue(undefined);

    const res = await request(app)
      .post("/upload-data")
      .attach("institutions", validXmlBuffer, "institutions.xml")
      .attach("degreeprogrammes", validXmlBuffer, "degreeprogrammes.xml");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(processUploadFiles).toHaveBeenCalledTimes(1);
  });

  it("should return 400 if one file is missing", async () => {
    const res = await request(app)
      .post("/upload-data")
      .attach("institutions", validXmlBuffer, "institutions.xml");

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Beide XML-Dateien");
  });

  it("should return 400 for non-XML file", async () => {
    const res = await request(app)
      .post("/upload-data")
      .attach("institutions", Buffer.from("abc"), "institutions.txt")
      .attach("degreeprogrammes", validXmlBuffer, "degreeprogrammes.xml");

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Fehler beim Hochladen");
  });

  it("should return 500 for invalid XML format", async () => {
    (processUploadFiles as jest.Mock).mockRejectedValue(
      new Error("INVALID_XML_FORMAT"),
    );

    const res = await request(app)
      .post("/upload-data")
      .attach("institutions", Buffer.from("invalid"), "institutions.xml")
      .attach("degreeprogrammes", validXmlBuffer, "degreeprogrammes.xml");

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Fehler beim Parsen der XML-Dateien");
  });

  it("should return 500 on service error", async () => {
    (processUploadFiles as jest.Mock).mockRejectedValue(
      new Error("database error"),
    );

    const res = await request(app)
      .post("/upload-data")
      .attach("institutions", validXmlBuffer, "institutions.xml")
      .attach("degreeprogrammes", validXmlBuffer, "degreeprogrammes.xml");

    expect(res.status).toBe(500);
    expect(res.body.error).toContain("Fehler beim Parsen der XML-Dateien");
  });
});

describe("getRiasecData handler", () => {
  let res: any;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 200 and RIASEC data on success", async () => {
    const mockData = {
      studienfelder: [],
      studiengebiete: [],
      studiengaenge: [],
    };
    (handleGetRiasecData as jest.Mock).mockResolvedValue(mockData);

    await getRiasecData({} as any, res);

    expect(handleGetRiasecData).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it("should return 500 and error details on failure", async () => {
    const mockError = new Error("DB failure");
    (handleGetRiasecData as jest.Mock).mockRejectedValue(mockError);

    await getRiasecData({} as any, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Fehler beim Abrufen der RIASEC-Daten",
      details: "DB failure",
    });
  });
});

describe("editRiasecData handler", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should update RIASEC data and return 200 on success", async () => {
    req = { body: { table: "studienfelder", id: 1, changes: { R: 5 } } };
    (handleEditRiasecData as jest.Mock).mockResolvedValue(undefined);

    await editRiasecData(req, res);

    expect(handleEditRiasecData).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "RIASEC-Daten erfolgreich aktualisiert",
      success: true,
    });
  });

  it("should return 500 and error details on failure", async () => {
    req = { body: { table: "studienfelder", id: 1, changes: { R: 5 } } };
    const mockError = new Error("Update failed");
    (handleEditRiasecData as jest.Mock).mockRejectedValue(mockError);

    await editRiasecData(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Fehler beim Aktualisieren der RIASEC-Daten",
      details: "Update failed",
    });
  });
});
