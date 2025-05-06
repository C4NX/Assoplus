import type { H3Event } from "h3"
import { createError } from "h3"
import type z from "zod"

/**
 * Validates the body of the request against a Zod schema
 * @param event H3 event
 * @param schema The Zod schema to validate
 * @returns The validated data
 * @throws 422 if the validation fails
 */
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

/**
 * Validates a query parameter against a Zod schema
 * @param event H3 event
 * @param paramName The name of the query parameter
 * @param schema The Zod schema to validate
 * @returns The validated data
 * @throws 422 if the validation fails
 */
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