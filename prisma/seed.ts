import { AssociationRole, DonationType, NewsPublicationStatus, PaymentMethod, PrismaClient, Role, TagType } from "@prisma/client"
import { faker } from "@faker-js/faker/locale/fr"
import { Scrypt } from "@adonisjs/hash/drivers/scrypt"

const ADMIN_EMAIL = "admin@admin.admin"

const prisma = new PrismaClient()

const userIds: string[] = []
const associationIds: string[] = []
let tagIds: number[] = []

async function cleanup() {
  await prisma.invite.deleteMany()
  await prisma.volunteer.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.news.deleteMany()
  await prisma.donation.deleteMany()
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
      roles: [Role.ROLE_USER, Role.ROLE_ADMIN],
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

function fakerRandomHtml(paragraphs: number) {
  const title = faker.lorem.sentence()
  const paragraphsArray = Array.from({ length: paragraphs }, () => faker.lorem.paragraphs(5))
  const linksArray = Array.from({ length: paragraphs }, () => faker.lorem.words(5))
  const effectsArray = Array.from({ length: paragraphs }, () => faker.lorem.words(5))
  const html = [
    `<h1>${title}</h1>`,
    ...paragraphsArray.map((paragraph, index) => {
      return `<p>${paragraph}</p>\n\n<a href="https://example.com">${linksArray[index]}</a>\n\n<em>${effectsArray[index]}</em>`
    }),
  ].join("\n\n")

  return html
}

async function createAssociation(n: number) {
  for (let i = 0; i < n; i++) {
    const membersId = new Set<string>()

    for (let j = 0; j < 5; j++) {
      const userId = userIds[Math.floor(Math.random() * userIds.length)]
      membersId.add(userId)
    }

    const tags = new Set<number>()

    for (let j = 0; j < 3; j++) {
      const tagId = tagIds[Math.floor(Math.random() * tagIds.length)]
      tags.add(tagId)
    }

    const result = await prisma.association.create({
      data: {
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
        tags: {
          connect: Array.from(tags).map(tagId => ({
            id: tagId,
          })),
        },
        members: {
          createMany: {
            data: Array.from(membersId).map((userId, index) => ({
              userId,
              roles: index === 0 ? [AssociationRole.PRESIDENT] : [faker.helpers.arrayElement(Object.values(AssociationRole).filter(role => role !== AssociationRole.PRESIDENT))],
            })),
          },
        },
        news: {
          createMany: {
            data: Array.from({ length: 30 }, () => {
              const createdById = userIds[Math.floor(Math.random() * userIds.length)]
              return {
                title: faker.lorem.sentence(),
                content: fakerRandomHtml(3),
                createdById,
                updatedById: createdById,
                status: faker.helpers.arrayElement(Object.values(NewsPublicationStatus)),
              }
            }),
          },
        },
        donations: {
          createMany: {
            data: Array.from({ length: 30 }, () => ({
              amount: parseFloat(faker.number.float({ min: 1, max: 1000 }).toFixed(2)),
              donorName: faker.person.fullName(),
              paymentMethod: faker.helpers.arrayElement(Object.values(PaymentMethod)),
              type: faker.helpers.arrayElement(Object.values(DonationType)),
              campaign: faker.lorem.sentence(),
              receiptNumber: `RCPT-${faker.string.numeric(5)}`,
            })),
          },
        },
      },
    })
    associationIds.push(result.id)
  }
}

async function createTags() {
  await prisma.tag.createMany({
    data: [
      {
        name: "Sport",
        type: TagType.TYPE_SPORT,
      },
      {
        name: "Culture",
        type: TagType.TYPE_CULTURE,
      },
      {
        name: "Environnement",
        type: TagType.TYPE_ENVIRONMENT,
      },
      {
        name: "Social",
        type: TagType.TYPE_SOCIAL,
      },
      {
        name: "LGBTQIA+",
        type: TagType.TYPE_LGBT,
      },
    ],
  })
  tagIds = (await prisma.tag.findMany({ select: { id: true } })).map(tag => tag.id)
}

async function main() {
  console.log("Seeding database...")
  await cleanup()
  console.log("Seeding users...")
  await createUser(10)
  await createUserAdmin()
  console.log("Seeding associations...")
  await createTags()
  await createAssociation(30)
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
