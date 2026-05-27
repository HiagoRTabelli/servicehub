require("dotenv").config();

const bcrypt = require("bcryptjs");
const prisma = require("./src/config/prisma");

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@servicehub.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin criado:", admin);
}

createAdmin()
  .catch((error) => {
    console.log(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });