import type { H3Event, MultiPartData } from "h3"
import type z from "zod"

export async function extractFileBufferFromRequest(event: H3Event, formName: string, mimeTypes: string[]) {
  const multipartFormData = await readMultipartFormData(event)

  const fileIndex = multipartFormData?.findIndex(({ name }) => name === formName)
  if (multipartFormData === undefined || fileIndex === -1 || fileIndex === undefined) {
    throw createError({ statusCode: 400, statusMessage: "Invalid request" })
  }
  if (!mimeTypes.includes(multipartFormData[fileIndex].type ?? "")) {
    throw createError({ statusCode: 400, statusMessage: "Invalid file type" })
  }
  return multipartFormData[fileIndex].data
}

export function validateMimeTypeFromMultipartFormData(multipartFormData: MultiPartData[] | undefined, formName: string, mimeTypes: string[]) {
  const fileIndex = multipartFormData?.findIndex(({ name }) => name === formName)
  if (multipartFormData === undefined || fileIndex === -1 || fileIndex === undefined) {
    throw createError({ statusCode: 400, statusMessage: "Invalid request" })
  }
  if (!mimeTypes.includes(multipartFormData[fileIndex].type ?? "")) {
    throw createError({ statusCode: 400, statusMessage: "Invalid file type" })
  }
  return multipartFormData[fileIndex].data
}

export async function validateBodyFromMultipartFormData<T>(multipartFormData: MultiPartData[] | undefined, formName: string, schema: z.ZodType<T>) {
  const fileIndex = multipartFormData?.findIndex(({ name }) => name === formName)
  if (multipartFormData === undefined || fileIndex === -1 || fileIndex === undefined) {
    throw createError({ statusCode: 400, statusMessage: "Invalid request" })
  }
  if (multipartFormData[fileIndex].type !== "application/json") {
    throw createError({ statusCode: 400, statusMessage: "Invalid file type" })
  }
  const bodyData = multipartFormData[fileIndex].data
  const body = JSON.parse(bodyData.toString())
  if (body === undefined) {
    throw createError({ statusCode: 400, statusMessage: "Invalid request" })
  }

  return await schema.parseAsync(body)
}

export function hasMultipartFileOfMimeType(multipartFormData: MultiPartData[] | undefined, formName: string, allowedMimeTypes: string[]) {
  if (multipartFormData === undefined) {
    return false
  }

  const fileIndex = multipartFormData.findIndex(({ name }) => name === formName)
  if (fileIndex === -1 || fileIndex === undefined) {
    return false
  }
  if (multipartFormData[fileIndex].type === undefined) {
    return false
  }

  if (!allowedMimeTypes.includes(multipartFormData[fileIndex].type)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid file type" })
  }

  return true 
}
