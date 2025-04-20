import { S3Client } from "@aws-sdk/client-s3";
import { env } from "process";

const s3 = new S3Client({
  region: env.AWS_REGION as string,
  credentials: {
    secretAccessKey: env.AWS_ACCESS_KEY_SECRET as string,
    accessKeyId: env.AWS_ACCESS_KEY_ID as string,
  },
});

export default s3;
