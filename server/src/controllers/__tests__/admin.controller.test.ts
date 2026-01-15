import request from "supertest";
import express from "express";
import {
  uploadMiddleware,
  handleMulterError,
  uploadData,
} from "../admin.controller";
import { processUploadFiles } from "../../services/admin.service";

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
