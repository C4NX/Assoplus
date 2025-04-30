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

export async function validateParam<T>(
  event: H3Event,
  paramName: string,
  schema: z.ZodSchema<T>,
): Promise<z.infer<typeof schema>> {
  const param = getRouterParam(event, paramName)

  if (!param) {
    throw createError({
      statusCode: 422,
      statusMessage: `Missing parameter ${paramName}`,
    })
  }

  const result = schema.safeParse(param)

  if (!result.success) {
    throw createError({
      statusCode: 422,
      statusMessage: "Validation error",
      data: result.error.flatten(),
    })
  }

  return result.data
}