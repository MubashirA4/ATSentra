import fs from "fs/promises";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

const PDF_MIME_TYPE = "application/pdf";

const DOCX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const extractPdfText = async (fileBuffer) => {
  const parser = new PDFParse({
    data: fileBuffer,
  });

  try {
    const result = await parser.getText();

    return result.text;
  } finally {
    await parser.destroy();
  }
};

const extractDocxText = async (fileBuffer) => {
  const result = await mammoth.extractRawText({
    buffer: fileBuffer,
  });

  return result.value;
};

export const extractResumeText = async ({
  filePath,
  mimeType,
}) => {
  const fileBuffer = await fs.readFile(filePath);

  if (mimeType === PDF_MIME_TYPE) {
    return extractPdfText(fileBuffer);
  }

  if (mimeType === DOCX_MIME_TYPE) {
    return extractDocxText(fileBuffer);
  }

  throw new Error("Unsupported resume format");
};