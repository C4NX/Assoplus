import { sendMail } from "~/server/util/mailer/mailer.service"
import { emailTemplateBase } from "~/server/util/mailer/templates"

export default defineEventHandler(async (event) => {
  
  await sendMail({
    to: "test@test.test",
    subject: "Test mail",
    html: emailTemplateBase(event,{
      title: "Test mail",
      content: "This is a test mail",
    })
  })
  
  return "ok"
})
