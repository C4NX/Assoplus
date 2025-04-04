import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import sharp from "sharp"
import { v4 as uuid } from "uuid"
import s3Client from "~/lib/s3client"
import type { H3Event } from "h3"
import { PublicUserInterface } from "~/shared/auth"
import prisma from "~/lib/prisma"
import { createLogger } from "~/server/util/logger/logger.service"

const logger = createLogger("files")

async function convertProfilePicture(buffer: Buffer) {
    return await sharp(buffer)
        .webp()
        .resize(512, 512)
        .toBuffer()
}

async function checkAndGetImageBuffer(event: H3Event, formName: string) {
    const multipartFormData = await readMultipartFormData(event)

    const fileIndex = multipartFormData?.findIndex(({ name }) => name === formName)

    if (multipartFormData === undefined || fileIndex === -1 || fileIndex === undefined) {
        throw createError({ statusCode: 400, statusMessage: "Invalid request" })
    }

    if (!["image/jpeg", "image/png"].includes(multipartFormData[fileIndex].type ?? "")) {
        throw createError({ statusCode: 400, statusMessage: "Invalid file type" })
    }

    return multipartFormData[fileIndex].data
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

    logger.trace(`User ${userId} uploaded a new avatar`)

    return newImageUuid
}


export async function updateUserAvatarFromBuffer(event: H3Event,userId: string, buffer: Buffer) {
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
    return await uploadAvatarFromBuffer(event, userId, await checkAndGetImageBuffer(event, formName))
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

export async function getAssociationLogoStream(associationId: number, logoUuid: string) {
    const { s3: { bucket } } = useRuntimeConfig()

    const result = await s3Client?.send(new GetObjectCommand({
        Bucket: bucket,
        Key: `associations/${associationId}/logos/${logoUuid}`,
    }))

    return result?.Body?.transformToWebStream()
}