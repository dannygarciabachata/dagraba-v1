import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    await prisma.systemSetting.upsert({
        where: { key: 'KIE_API_KEY' },
        update: { value: '2c17e93cb4a1907eee1cada77e2861b1' },
        create: {
            key: 'KIE_API_KEY',
            value: '2c17e93cb4a1907eee1cada77e2861b1',
            category: 'system'
        }
    })

    await prisma.systemSetting.upsert({
        where: { key: 'OPENAI_API_KEY' },
        update: { value: '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' },
        create: {
            key: 'OPENAI_API_KEY',
            value: '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',
            category: 'system'
        }
    })

    console.log('Keys seeded to Neon Postgres DB via Prisma.')
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
