import { eq } from "drizzle-orm";
import { db } from "../src/db/client";
import { apiKeys, users } from "../src/db/schema";
import { generateApiKey, hashApiKey } from "../src/lib/api-keys";

async function main() {
  // Find the pro user (daniel.howells@gmail.com)
  const user = await db.query.users.findFirst({
    where: eq(users.email, "daniel.howells@gmail.com"),
  });

  if (!user) {
    console.error("User not found");
    process.exit(1);
  }

  console.log("Found user:", user.email, "plan:", user.plan);

  // Generate a new API key
  const fullKey = generateApiKey();
  const keyHash = await hashApiKey(fullKey);
  const keyPrefix = fullKey.substring(0, 12);

  // Insert the key
  const [key] = await db
    .insert(apiKeys)
    .values({
      userId: user.id,
      name: "CLI Test Key",
      keyHash,
      keyPrefix,
    })
    .returning();

  console.log("Created API key:", key.id);
  console.log("Full key (save this!):", fullKey);
}

main().catch(console.error);
