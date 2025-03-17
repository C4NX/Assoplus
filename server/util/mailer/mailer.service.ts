import { createLogger } from "~/server/util/logger/logger.service"
import nodemailerTransport from "~/lib/nodemailer"

const logger = createLogger("mailer")

export interface SendMailOptions {
  to: string | string[]
  subject: string
  text?: string
  html?: string
  from?: string
}

export async function sendMail(options: SendMailOptions): Promise<void> {
  try {
    const from = options.from || useRuntimeConfig().smtp?.from

    if (!from) {
      throw new Error("No default from address provided")
    }

    if (process.env.NODE_ENV !== "production") {
      logger.trace("Sending email to", options.to)
    }

    await nodemailerTransport?.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    })
  }
  catch (error) {
    logger.error("Email sending failed:", error)
    throw createError({ status: 500, message: "Failed to send email" })
  }
}
