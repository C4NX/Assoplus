import { PrismaClient, type Association } from "@prisma/client"
import { createLogger } from "~/server/util/logger/logger.service"

const logger = createLogger("prisma")

const prismaClientSingleton = () => {
  const prismaClient = new PrismaClient().$extends({
    result: {
      association: {
        logoPathUrl: {
          needs: { logoPath: true },
          compute: (model: Association) => model.logoPath ? `/api/association/${model.id}/logo` : null,
        },
      },
    },
  })
  logger.info("Created prisma client singleton")
  return prismaClient
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma
