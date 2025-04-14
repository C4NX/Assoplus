import type { H3Event } from "h3"
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuid } from "uuid"
import sharp from "sharp"
import s3Client from "~/lib/s3client"
import { filesLogger } from "~/server/util/logger/logger.service"

async function convertAssociationLogo(buffer: Buffer) {
  return await sharp(buffer)
    .webp()
    .resize(512, 512)
    .toBuffer()
}

export async function uploadAssociationLogoFromBuffer(event: H3Event, associationId: number, buffer: Buffer) {
  const { s3: { bucket } } = useRuntimeConfig(event)

  const newImageUuid = uuid()
  const s3Key = `associations/${associationId}/logos/${newImageUuid}`

  await s3Client?.send(new PutObjectCommand({
    Bucket: bucket,
    Key: s3Key,
    Body: await convertAssociationLogo(buffer),
  }))

  filesLogger.trace(`Association ${associationId} uploaded a new logo`)

  return newImageUuid
}

export async function getAssociationLogoStream(associationId: number, logoUuid: string) {
  const { s3: { bucket } } = useRuntimeConfig()

  const result = await s3Client?.send(new GetObjectCommand({
    Bucket: bucket,
    Key: `associations/${associationId}/logos/${logoUuid}`,
  }))

  return result?.Body?.transformToWebStream()
}
