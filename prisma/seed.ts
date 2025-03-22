import { PrismaClient } from "@prisma/client"
import { faker } from "@faker-js/faker"
import { Scrypt } from "@adonisjs/hash/drivers/scrypt"

const ADMIN_EMAIL = "admin@admin.admin"

const prisma = new PrismaClient()

async function cleanup() {
  await prisma.user.deleteMany()
  await prisma.association.deleteMany()
}

async function hashPassword(password: string) {
  const scrypt = new Scrypt({})
  return scrypt.make(password)
}

async function createUserAdmin() {
  console.log(`> ${ADMIN_EMAIL} (admin)`)
  await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      firstName: "Admin",
      lastName: "Admin",
      passwordHash: await hashPassword(ADMIN_EMAIL),
      isVerified: true,
      roles: ["ROLE_USER", "ROLE_ADMIN"],
    },
  })
}

async function createUser(n: number) {
  for (let i = 0; i < n; i++) {
    const email = faker.internet.email()
    console.log(`> ${email}`)
    await prisma.user.create({
      data: {
        email,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        passwordHash: await hashPassword(email),
        isVerified: true,
      },
    })
  }
}

async function createAssociation(n: number) {
  for (let i = 0; i < n; i++) {
    await prisma.association.create({
      data: {
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
      },
    })
  }
}

async function main() {
  await cleanup()
  await createUser(10)
  await createUserAdmin()
  await createAssociation(10)
  console.log("Seed complete")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
