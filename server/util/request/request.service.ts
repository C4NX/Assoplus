import { H3Event, createError } from "h3"
import z from "zod"

export async function validateBodySchema<T>(
  event: H3Event,
  schema: z.ZodSchema<T>,
): Promise<z.infer<typeof schema>> {
  const result = await readValidatedBody(event, schema.safeParse)

  if (!result.success) {
    throw createError({
      statusCode: 422,
      statusMessage: "Validation error",
      data: result.error.flatten(),
    })
  }

  return result.data
}