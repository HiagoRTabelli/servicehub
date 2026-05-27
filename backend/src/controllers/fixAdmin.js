const prisma = require("./src/config/prisma");

async function fixAdmin() {
  const user = await prisma.user.update({
    where: {
      email: "admin@servicehub.com",
    },
    data: {
      role: "ADMIN",
    },
  });

  console.log("Admin corrigido:", user);
}

fixAdmin()
  .catch((error) => {
    console.log(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });