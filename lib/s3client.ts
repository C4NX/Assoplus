import { S3Client } from "@aws-sdk/client-s3"
import { createLogger } from "~/server/util/logger/logger.service"

const logger = createLogger("S3Client")

const createS3ClientSingleton = () => {
  const {
    s3: {
      region,
      endpoint,
      secretAccessKey,
      accessKeyId,
    },
  } = useRuntimeConfig()

  if (!region || !endpoint || !secretAccessKey || !accessKeyId) {
    logger.error("Missing S3 configuration (NUXT_S3_REGION, NUXT_S3_ENDPOINT, NUXT_S3_SECRET_ACCESS_KEY, NUXT_S3_ACCESS_KEY_ID)")
    return null
  }

  try {
    const s3Client = new S3Client({
      region,
      endpoint,
      credentials: {
        secretAccessKey,
        accessKeyId,
      },
      // b2 does not support checksums requests/responses
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
    })

    logger.info("Created S3 Client singleton")

    return s3Client
  }
  catch (error) {
    logger.error("Failed to create S3 Client", error)
    return null
  }
}

declare const globalThis: {
  s3ClientGlobal: ReturnType<typeof createS3ClientSingleton>
} & typeof global

const s3Client = globalThis.s3ClientGlobal ?? createS3ClientSingleton()

export default s3Client

if (process.env.NODE_ENV !== "production") globalThis.s3ClientGlobal = s3Client
