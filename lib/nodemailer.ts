import { createTransport } from "nodemailer"
import { createLogger } from "~/server/util/logger/logger.service"

const logger = createLogger("nodemailer")

const nodemailerTransporterSingleton = () => {
  const { smtpUser, smtpHost, smtpPass, smtpPort, smtpSecure } = useRuntimeConfig()

  try {
    const transporter = createTransport({
      host: smtpHost,
      port: smtpPort ?? 587,
      secure: Boolean(smtpSecure),
      auth: (smtpUser || smtpPass)
        ? {
            user: smtpUser,
            pass: smtpPass,
          }
        : undefined,
    })

    logger.info("Created singleton nodemailer transporter")

    return transporter
  }
  catch (error) {
    logger.error("Failed to create nodemailer transporter", error)
    return null
  }
}

declare const globalThis: {
  nodemailerTransportGlobal: ReturnType<typeof nodemailerTransporterSingleton>
} & typeof global

const nodemailerTransport = globalThis.nodemailerTransportGlobal ?? nodemailerTransporterSingleton()

export default nodemailerTransport

if (process.env.NODE_ENV !== "production") globalThis.nodemailerTransportGlobal = nodemailerTransport
