import type { H3Event, MultiPartData } from "h3"
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import sharp from "sharp"
import { extractFileBufferFromRequest, validateMimeTypeFromMultipartFormData } from "../request/files.service"
import s3Client from "~/lib/s3client"
import { filesLogger } from "~/server/util/logger/logger.service"

async function convertAssociationLogo(buffer: Buffer) {
  return await sharp(buffer)
    .webp()
    .resize(512, 512)
    .toBuffer()
}

export async function uploadAssociationLogoFromRequest(event: H3Event, multipartFormData: MultiPartData[] | undefined, associationId: string, formName: string) {
  const buffer = validateMimeTypeFromMultipartFormData(multipartFormData, formName, ["image/jpeg", "image/png", "image/jpg"])
  return await uploadAssociationLogoFromBuffer(event, associationId, buffer)
}

export async function uploadAssociationLogoFromBuffer(event: H3Event, associationId: string, buffer: Buffer) {
  const { s3: { bucket } } = useRuntimeConfig(event)

  const s3Key = `associations/${associationId}/logo`

  await s3Client?.send(new PutObjectCommand({
    Bucket: bucket,
    Key: s3Key,
    Body: await convertAssociationLogo(buffer),
  }))

  filesLogger.trace(`Association ${associationId} uploaded a new logo`)

  return s3Key
}

export async function getAssociationLogoStream(associationId: string) {
  const { s3: { bucket } } = useRuntimeConfig()

  const result = await s3Client?.send(new GetObjectCommand({
    Bucket: bucket,
    Key: `associations/${associationId}/logo`,
  }))

  return result?.Body?.transformToWebStream()
}
