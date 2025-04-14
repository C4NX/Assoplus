import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import sharp from "sharp"
import { v4 as uuid } from "uuid"
import type { H3Event } from "h3"
import { filesLogger } from "../logger/logger.service"
import s3Client from "~/lib/s3client"
import type { PublicUserInterface } from "~/shared/auth"
import prisma from "~/lib/prisma"
import { extractFileBufferFromRequest } from "~/server/util/request/files.service"

async function convertProfilePicture(buffer: Buffer) {
  return await sharp(buffer)
    .webp()
    .resize(512, 512)
    .toBuffer()
}

export async function uploadAvatarFromBuffer(event: H3Event, userId: string, buffer: Buffer) {
  const { s3: { bucket } } = useRuntimeConfig(event)

  const newImageUuid = uuid()
  const s3Key = `avatars/${userId}/${newImageUuid}`

  await s3Client?.send(new PutObjectCommand({
    Bucket: bucket,
    Key: s3Key,
    Body: await convertProfilePicture(buffer),
  }))

  filesLogger.trace(`User ${userId} uploaded a new avatar`)

  return newImageUuid
}

export async function updateUserAvatarFromBuffer(event: H3Event, userId: string, buffer: Buffer) {
  const avatarUuid = await uploadAvatarFromBuffer(event, userId, buffer)

  await prisma.user.update({
    where: { id: userId },
    data: {
      avatarUuid: avatarUuid,
    },
  })

  return avatarUuid
}

export async function uploadAvatarFromRequest(event: H3Event, userId: string, formName: string) {
  return await uploadAvatarFromBuffer(event, userId, await extractFileBufferFromRequest(event, formName, ["image/jpeg", "image/png"]))
}

export async function getAvatarStream(user: PublicUserInterface) {
  const { s3: { bucket } } = useRuntimeConfig()

  if (!user.avatarUuid) {
    return null
  }

  const result = await s3Client?.send(new GetObjectCommand({
    Bucket: bucket,
    Key: `avatars/${user.id}/${user.avatarUuid}`,
  }))

  return result?.Body?.transformToWebStream()
}
