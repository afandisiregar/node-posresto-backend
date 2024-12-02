import bcrypt from "bcrypt";
import prisma from "../../index";

async function seed() {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash("password", 10);

    // Define the admin data
    const users = [
      {
        name: "Admin",
        email: "admin@local.com",
        password: hashedPassword,
        role: "admin",
        is_active: true,
      },
    ];

    // Create users
    for (const user of users) {
      const findUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (findUser) {
        console.info(`User already exists: ${user.name}`);
        continue;
      }

      await prisma.user.create({
        data: user,
      });

      console.info(`Created user: ${user.name}`);
    }
  } catch (error) {
    console.error("Error while seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export { seed };
