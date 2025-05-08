import { AssociationRole, NewsPublicationStatus, PrismaClient } from "@prisma/client"
import { faker } from "@faker-js/faker"
import { Scrypt } from "@adonisjs/hash/drivers/scrypt"

const ADMIN_EMAIL = "admin@admin.admin"

const prisma = new PrismaClient()

const userIds: string[] = []
const associationIds: string[] = []

async function cleanup() {
  await prisma.volunteer.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.news.deleteMany()
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

function fakerRandomMarkdown(paragraphs: number) {
  const title = faker.lorem.sentence()
  const paragraphsArray = Array.from({ length: paragraphs }, () => faker.lorem.paragraphs(5))
  const linksArray = Array.from({ length: paragraphs }, () => faker.lorem.words(5))
  const effectsArray = Array.from({ length: paragraphs }, () => faker.lorem.words(5))
  const markdown = [
    `# ${title}`,
    ...paragraphsArray.map((paragraph, index) => {
      return `${paragraph}\n\n[${linksArray[index]}](https://example.com)\n\n*${effectsArray[index]}*`
    }),
  ].join("\n\n")

  return markdown
}

async function createAssociation(n: number) {
  for (let i = 0; i < n; i++) {
    const membersId = new Set<string>()

    for (let j = 0; j < 5; j++) {
      const userId = userIds[Math.floor(Math.random() * userIds.length)]
      membersId.add(userId)
    }

    const result = await prisma.association.create({
      data: {
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
        tags: {
          connect: await createTag(3),
        },
        members: {
          createMany: {
            data: Array.from(membersId).map((userId, index) => ({
              userId,
              roles: index === 0 ? [AssociationRole.PRESIDENT] : [faker.helpers.arrayElement(Object.values(AssociationRole).filter(role => role !== AssociationRole.PRESIDENT))],
            })),
          }
        },
        news: {
          createMany: {
            data: Array.from({ length: 30 }, () => ({
              title: faker.lorem.sentence(),
              content: fakerRandomMarkdown(3),
              createdById: userIds[Math.floor(Math.random() * userIds.length)],
              status: faker.helpers.arrayElement(Object.values(NewsPublicationStatus))
            })),
          },
        },
      },
    })
    associationIds.push(result.id)
  }
}

async function createTag(n: number) {
  return await prisma.tag.createManyAndReturn({
    data: Array.from({ length: n }, () => ({
      name: faker.lorem.word(),
    })),
  })
}

async function main() {
  console.log("Seeding database...")
  await cleanup()
  console.log("Seeding users...")
  await createUser(10)
  await createUserAdmin()
  console.log("Seeding associations...")
  await createAssociation(100)
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
