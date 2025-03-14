import bcrypt from "bcrypt"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { createError } from "h3"
import prisma from "@/lib/prisma"

interface CreateUserInterface {
  email: string
  password: string
  firstName: string
  lastName: string
}

export async function handleCreateUser({ email, password, firstName, lastName }: CreateUserInterface) {
  const salt = await bcrypt.genSalt(10)
  try {
    return await prisma.user.create({
      data: {
        email: email,
        passwordHash: await bcrypt.hash(password, salt),
        firstName: firstName,
        lastName: lastName,
      },
    })
  }
  catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        throw createError({ statusCode: 409, statusMessage: "Email already in use" })
      }
    }
    throw e
  }
}
