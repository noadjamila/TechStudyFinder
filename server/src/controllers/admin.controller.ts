import { Request, Response, NextFunction } from "express";
import multer from "multer";
import {
  processUploadFiles,
  handleGetRiasecData,
  handleEditRiasecData,
} from "../services/admin.service";

/**
 * Multer configuration for handling XML file uploads in memory.
 * Limits file size to 100MB and only allows XML files.
 */
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

/**
 * Multer middleware to handle uploading of two XML files:
 * - institutions
 * - degreeprogrammes
 */
export const uploadMiddleware = upload.fields([
  { name: "institutions", maxCount: 1 },
  { name: "degreeprogrammes", maxCount: 1 },
]);

/**
 * Error handler for Multer file upload errors.
 */
export function handleMulterError(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "Datei zu groß",
        details: "Die maximale Dateigröße beträgt 100MB.",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        error: "Zu viele Dateien",
        details: "Bitte laden Sie genau zwei Dateien hoch.",
      });
    }
    return res.status(400).json({
      error: "Fehler beim Hochladen der Datei",
      details: err.message,
    });
  }
  if (err) {
    return res.status(400).json({
      error: "Fehler beim Hochladen",
      details: err.message,
    });
  }
  next();
}

/**
 * Controller to handle XML file uploads and initialize the database.
 * @param req the request object with uploaded files
 * @param res the response object with status and messages
 * @returns JSON response indicating success or failure
 */
export async function uploadData(req: Request, res: Response) {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const institutionsFile = files?.institutions?.[0];
    const degreeprogrammesFile = files?.degreeprogrammes?.[0];

    if (!institutionsFile || !degreeprogrammesFile) {
      return res.status(400).json({
        error:
          "Beide XML-Dateien (institutions und degreeprogrammes) müssen hochgeladen werden",
        details:
          institutionsFile && !degreeprogrammesFile
            ? "Fehlende Datei: degreeprogrammes"
            : !institutionsFile && degreeprogrammesFile
              ? "Fehlende Datei: institutions"
              : "Beide Dateien fehlen",
      });
    }

    await processUploadFiles({
      institutionsXml: institutionsFile.buffer.toString("utf-8"),
      degreeprogrammesXml: degreeprogrammesFile.buffer.toString("utf-8"),
    });

    res.status(200).json({
      message: "Datenbank erfolgreich mit hochgeladenen Dateien initialisiert",
      success: true,
    });
  } catch (error) {
    console.error("Fehler beim Upload:", error);

    // Spezifische Fehlermeldungen für verschiedene Fehlertypen
    let errorMessage = "Fehler beim Verarbeiten der hochgeladenen Dateien";
    let details = error instanceof Error ? error.message : String(error);

    if (error instanceof Error) {
      // Datenbank-Fehler
      if (details.includes("ROLLBACK") || details.includes("database")) {
        errorMessage = "Datenbankfehler beim Import";
        details =
          "Die Datenbank konnte die Daten nicht verarbeiten. Bitte überprüfen Sie die XML-Dateien.";
      }
      // XML-Parsing-Fehler
      if (details.includes("XML") || details.includes("parse")) {
        errorMessage = "Fehler beim Parsen der XML-Dateien";
        details =
          "Die XML-Dateien konnten nicht gelesen werden. Bitte überprüfen Sie das Format.";
      }
    }

    res.status(500).json({
      error: errorMessage,
      details: details,
    });
  }
}

/**
 * Express handler to fetch all RIASEC data.
 * Calls the service `handleGetRiasecData` and returns JSON.
 *
 * @param {Request} __req - Express request object (unused here)
 * @param {Response} res - Express response object
 */
export async function getRiasecData(__req: Request, res: Response) {
  try {
    const riasecData = await handleGetRiasecData();
    res.status(200).json(riasecData);
  } catch (error) {
    console.error("Fehler beim Abrufen der RIASEC-Daten:", error);
    res.status(500).json({
      error: "Fehler beim Abrufen der RIASEC-Daten",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Express handler to update RIASEC data for an item.
 * Calls the service `handleEditRiasecData` with the request body.
 *
 * @param {Request} req - Express request object. Expects `body` to contain the RIASEC updates.
 * @param {Response} res - Express response object
 */
export async function editRiasecData(req: Request, res: Response) {
  try {
    const riasecUpdates = req.body;
    await handleEditRiasecData(riasecUpdates);
    res.status(200).json({
      message: "RIASEC-Daten erfolgreich aktualisiert",
      success: true,
    });
  } catch (error) {
    console.error("Fehler beim Aktualisieren der RIASEC-Daten:", error);
    res.status(500).json({
      error: "Fehler beim Aktualisieren der RIASEC-Daten",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
