/* eslint-disable @typescript-eslint/no-explicit-any */

import { Readable } from "node:stream"
import { stringify } from "csv-stringify"
import type { H3Event } from "h3"

export async function isRequestingCsv(event: H3Event) {
  const accept = getHeader(event, "Accept")
  if (!accept) {
    return false
  }
  return accept.includes("text/csv") || accept.includes("application/csv")
}

interface ExportCsvOptions {
  /**
     * If true, the CSV delimiter will be taken from the query parameter `delimiter`. It accepts only one character.
     * @default false
     * @example ?delimiter=;
     */
  delimiterFromQuery?: boolean
  /**
     * CSV delimiter
     * @default ';'
     */
  delimiter?: string
  /**
     * CSV filename
     * @default 'export.csv'
     */
  filename?: string
  /**
   * Transform function to modify the data before exporting
   * @param data - The data to be transformed
   * @returns The transformed data
   */
  transform?: (data: Record<string, any>[]) => Record<string, any>[]
}

export async function exportCsv(
  event: H3Event,
  data: Record<string, any>[],
  options?: ExportCsvOptions,
) {
  const delimiter = options?.delimiterFromQuery ? getQuery(event).delimiter?.toString()?.substring(0, 1) : options?.delimiter

  const stringifier = stringify({
    delimiter: delimiter ?? ";",
    header: true,
    columns: data.length > 0 ? Object.keys(data[0]) : [],
  })

  const readable = Readable.from(options?.transform ? options.transform(data) : data)

  setResponseHeader(event, "Content-Type", "text/csv")
  setResponseHeader(event, "Content-Disposition", `attachment; filename="${options?.filename ?? "export.csv"}"`)

  return readable.pipe(stringifier)
}
