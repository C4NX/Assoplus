import { createTransport } from "nodemailer"
import { createLogger } from "~/server/util/logger/logger.service"

const logger = createLogger("nodemailer")

const nodemailerTransporterSingleton = () => {
  const {
    smtp: {
      host,
      port,
      user,
      pass,
      secure,
    },
  } = useRuntimeConfig()

  try {
    const transporter = createTransport({
      host: host ?? "localhost",
      port: port ?? 587,
      secure: Boolean(secure),
      auth: (user || pass)
        ? {
            user: user,
            pass: pass,
          }
        : undefined,
    })

    logger.info("Created Nodemailer transporter singleton")

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
