import { H3Event } from 'h3'

export async function extractFileBufferFromRequest(event: H3Event, formName: string, mimeTypes: string[]) {
    const multipartFormData = await readMultipartFormData(event)
    const fileIndex = multipartFormData?.findIndex(({ name }) => name === formName)
    if (multipartFormData === undefined || fileIndex === -1 || fileIndex === undefined) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid request' })
    }
    if (!mimeTypes.includes(multipartFormData[fileIndex].type ?? '')) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid file type' })
    }
    return multipartFormData[fileIndex].data
}