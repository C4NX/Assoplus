import { PrismaClient } from "@prisma/client"
import { faker } from "@faker-js/faker"
import { Scrypt } from "@adonisjs/hash/drivers/scrypt"

const ADMIN_EMAIL = "admin@admin.admin"

const prisma = new PrismaClient()

const userIds: string[] = []
const associationIds: number[] = []

async function cleanup() {
  await prisma.associationMember.deleteMany()
  await prisma.associationTag.deleteMany()
  await prisma.association.deleteMany()
  await prisma.user.deleteMany()
}

async function hashPassword(password: string) {
  const scrypt = new Scrypt({})
  return scrypt.make(password)
}

async function createUserAdmin() {
  console.log(`> ${ADMIN_EMAIL} (admin)`)
  const result = await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      firstName: "Admin",
      lastName: "Admin",
      passwordHash: await hashPassword(ADMIN_EMAIL),
      isVerified: true,
      roles: ["ROLE_USER", "ROLE_ADMIN"],
    },
  })
  userIds.push(result.id)
}

async function createUser(n: number) {
  for (let i = 0; i < n; i++) {
    const email = faker.internet.email()
    console.log(`> ${email}`)
    const result = await prisma.user.create({
      data: {
        email,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        passwordHash: await hashPassword(email),
        isVerified: true,
      },
    })
    userIds.push(result.id)
  }
}

async function createAssociation(n: number) {
  for (let i = 0; i < n; i++) {
    const result = await prisma.association.create({
      data: {
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
        ownerId: userIds[Math.floor(Math.random() * userIds.length)],
        tags: {
          connect: await createAssociationTag(3),
        },
      },
    })
    associationIds.push(result.id)
  }
}

async function createAssociationTag(n: number) {
  return await prisma.associationTag.createManyAndReturn({
    data: Array.from({ length: n }, () => ({
      name: faker.lorem.word(),
    })),
  })
}

async function createAssociationMember(nMinPerAssociation: number, nMaxPerAssociation: number) {
  const hasRegistered = faker.datatype.boolean({ probability: 0.5 })
  for (let i = 0; i < associationIds.length; i++) {
    await prisma.associationMember.createMany({
      data: Array.from({ length: faker.number.int({ min: nMinPerAssociation, max: nMaxPerAssociation }) }, () => ({
        userId: hasRegistered ? userIds[Math.floor(Math.random() * userIds.length)] : null,
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        role: "Développeur",
        isVerified: faker.datatype.boolean(),
        isPending: faker.datatype.boolean(),
        associationId: associationIds[i],
      })),
    })
  }
}

async function main() {
  console.log("Seeding database...")
  await cleanup()
  console.log("Seeding users...")
  await createUser(10)
  await createUserAdmin()
  console.log("Seeding associations...")
  await createAssociation(100)
  await createAssociationMember(5, 10)
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
