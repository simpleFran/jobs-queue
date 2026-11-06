import bcrypt from "bcryptjs";
import { User } from "./src/types/user.types.js";
import { prisma } from "./src/lib/prisma.js";

async function seedDefaultUser() {
  const existingDefaultUser = await prisma.user.findUnique({
    where: {
      email: "sistema@empresa.com",
    },
  });

  if (!existingDefaultUser) {
    console.log("Default user not found.");
    return null;
  }

  //atualiza tabela Item campo userId com o id do usuário padrão
  try {
   const result = await prisma.item.updateMany({
        where:{
            userId:null
        },
      data: {
        userId: existingDefaultUser.id,
      },
    });

    console.log(`Updated ${result.count} items with default user ID.`);
  } catch (error) {
    console.error("Error updating items with default user ID:", error);
  }
}

async function insertDefaultUser() {
  const defaultUser: User = {
    // name: "Default User",
    email: "sistema@empresa.com",
    passwordHash: await bcrypt.hash("defaultpassword", 10),
    createdAt: new Date(),
  };

  await prisma.user.create({
    data: defaultUser,
  });
}

async function main() {
    await insertDefaultUser();
    await seedDefaultUser();
}

main()