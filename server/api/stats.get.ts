import { defineEventHandler } from "h3"
import { sendMail } from "../util/mailer/mailer.service"
import prisma from "~/lib/prisma"

export default defineEventHandler(async () => {
  await sendMail({
    to: "test@test.test",
    subject: "Test",
    text: "Test",
    html: "<p>Test</p>",
  })

  return {
    associations: await prisma.association.count(),
  }
})
