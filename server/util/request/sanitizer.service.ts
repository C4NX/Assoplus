import { JSDOM } from "jsdom"
import type { Config } from "dompurify"
import DOMPurify from "dompurify"

export interface SanitizeOptions {
  purifyOptions?: Config
}

export function sanitize(html: string, options: SanitizeOptions = {}): string {
  const purify = DOMPurify(new JSDOM(html).window)
  return purify.sanitize(html, options.purifyOptions)
}
