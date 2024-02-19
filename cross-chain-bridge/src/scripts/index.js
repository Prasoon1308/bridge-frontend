const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function saveL1Transaction() {
  try {
    // const savedL1Transaction = await prisma.l1Transaction.create({
    //   data: {
    //     rootTokenAddress: "rootToken",
    //     fromAddress: "userAddress",
    //     amount: 10000000,
    //     nonce: 1,
    //     eventType: "Deposit",
    //   },
    // });

    // const savedL1Transaction = await prisma.l1Transaction.update({
    //     where: { id: 1 },
    //     data: {
    //             rootTokenAddress: "rootToken",
    //             fromAddress: "userAddress",
    //             amount: 10000000,
    //             nonce: 1,
    //             eventType: "Deposit",
    //           },
    //   })
    // console.log("L1 Transaction saved to the database:", savedL1Transaction);

    // const lastDetails = await prisma.l1Transaction.findMany({
    //   where: {
    //     fromAddress: "0x87B940e50c82b5498896ba43003Bf8cA26f717FB"
    //   },
    //   orderBy: {
    //     timestamp: "desc"
    //   },
    //   take: 1
    // })
    // const details = lastDetails[0]
    // console.log(details.rootTokenAddress, details.fromAddress, details.amount, details.nonce, details.eventType, details.timestamp)
    
    const allTransactions = await prisma.l1Transaction.findMany({
      where: {
        fromAddress: "0x87B940e50c82b5498896ba43003Bf8cA26f717FB",
        l2Hash: null
      },
      orderBy: {
        timestamp: "desc"
      }
    });
    console.log(allTransactions)
  } catch (error) {
    console.error("Error saving L1 Transaction to the database:", error);
  }
};

saveL1Transaction()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
