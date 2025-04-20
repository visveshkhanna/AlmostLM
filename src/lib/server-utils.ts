"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "process";
import s3 from "./aws/s3";
import PdfParse from "pdf-parse";
import { openai } from "./openai";

/**
 * Uploads a file to S3
 */
export async function uploadFileToS3(
  file: File,
  path: string
): Promise<{
  url: string;
  fileName: string;
  mimetype: string;
}> {
  const fileName = file.name;
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const mimetype = file.type;

  const params = {
    Bucket: env.AWS_BUCKET as string,
    Key: `${path}/${fileName}`,
    Body: fileBuffer,
    ContentType: mimetype,
  };

  const command = new PutObjectCommand(params);

  await s3.send(command);

  return {
    url: `${env.AWS_BUCKET_URL}/${path}/${fileName}`,
    fileName: fileName,
    mimetype: mimetype,
  };
}

export async function getTextFromFile(file: File): Promise<{
  text: string | null;
  type: string | null;
}> {
  const fileType = file.type;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  if (fileType === "application/pdf") {
    const { text } = await PdfParse(fileBuffer);

    return { text, type: "pdf" };
  }

  if (fileType.split("/")[0] === "audio") {
    try {
      const response = await openai.audio.transcriptions.create({
        file: file,
        model: "whisper-1",
      });

      return { text: response.text, type: "audio" };
    } catch (error) {
      console.error(error);
      return { text: null, type: null };
    }
  }

  if (file.name.split(".").pop() === "txt") {
    const text = await file.text();
    return { text, type: "text" };
  }

  return { text: null, type: null };
}
