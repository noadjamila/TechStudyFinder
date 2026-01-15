import { Request, Response } from "express";
import multer from "multer";
import { initializeDatabaseWithUpload } from "../../db/scripts/init_data_with_upload";

// Multer-Konfiguration für Memory Storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB Limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/xml" || file.originalname.endsWith(".xml")) {
      cb(null, true);
    } else {
      cb(new Error("Nur XML-Dateien sind erlaubt"));
    }
  },
});

// Middleware für zwei XML-Dateien
export const uploadMiddleware = upload.fields([
  { name: "institutions", maxCount: 1 },
  { name: "degreeprogrammes", maxCount: 1 },
]);

export async function uploadData(req: Request, res: Response) {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const institutionsFile = files?.institutions?.[0];
    const degreeprogrammesFile = files?.degreeprogrammes?.[0];

    if (!institutionsFile || !degreeprogrammesFile) {
      return res.status(400).json({
        error:
          "Beide XML-Dateien (institutions und degreeprogrammes) müssen hochgeladen werden",
      });
    }

    // XML-Daten als String aus den Buffer-Objekten extrahieren
    const institutionsXml = institutionsFile.buffer.toString("utf-8");
    const degreeprogrammesXml = degreeprogrammesFile.buffer.toString("utf-8");

    // Datenbank-Initialisierung mit hochgeladenen Dateien durchführen
    await initializeDatabaseWithUpload(institutionsXml, degreeprogrammesXml);

    res.status(200).json({
      message: "Datenbank erfolgreich mit hochgeladenen Dateien initialisiert",
    });
  } catch (error) {
    console.error("Fehler beim Upload:", error);
    res.status(500).json({
      error: "Fehler beim Verarbeiten der hochgeladenen Dateien",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
