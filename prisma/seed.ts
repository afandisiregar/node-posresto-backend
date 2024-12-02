import fs from "fs";
import path from "path";

async function main() {
  const seedDir = path.join(__dirname, "seeds");
  const specificSeed = process.argv[2]; // Get the specific seed file name from the command line

  // Get all seed files or filter by the specific seed name
  let seedFiles = fs
    .readdirSync(seedDir)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js")); // Adjust for TypeScript or JavaScript

  if (specificSeed) {
    seedFiles = seedFiles.filter((file) => file.includes(specificSeed));
  }

  for (const file of seedFiles) {
    const seedFilePath = path.join(seedDir, file);
    const { seed } = await import(seedFilePath); // Use dynamic import for ES modules
    console.log(`Running seed file: ${file}`);
    await seed();
  }
  console.log("All seed files executed.");
  process.exit(1);
}

main().catch((err) => {
  console.error("Error while seeding:", err);
  process.exit(1);
});
