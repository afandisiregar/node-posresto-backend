import { PrismaClient } from "@prisma/client";
import app from "./src/main";
import { createServer } from "http";

const prisma = new PrismaClient();

const PORT = process.env.PORT || 4000;

const httpServer = createServer(app);

async function getConnectionToDB() {
  try {
    await prisma.$connect();
    console.log("Connected to DB");
  } catch (error) {
    console.error("Error connecting to DB");
    console.error(error);
    throw error;
  }
}

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  getConnectionToDB();
});

export default prisma;
