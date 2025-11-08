import { execSync } from "child_process";
import pkg from "fs-extra";

const { readFileSync, writeFileSync } = pkg;

const configFilePath = ".prettierrc";
const lineToRemove =
  '"plugins": ["@trivago/prettier-plugin-sort-imports","prettier-plugin-tailwindcss"],';

// Step 1: Read the file
const fileContent = readFileSync(configFilePath, "utf8");

// Step 2: Remove the specified line
const modifiedContent = fileContent
  .split("\n")
  .filter((line) => !line.includes(lineToRemove))
  .join("\n");

// Step 3: Write the modified content back to the file
writeFileSync(configFilePath, modifiedContent, "utf8");

// Step 4: Run the desired command (e.g., "your-command")
// Note: Replace 'your-command' with the actual command you want to run
try {
  execSync(
    "npx @rtk-query/codegen-openapi lib/redux/api/openapi-config.ts",
    {
      stdio: "inherit",
    },
  );
} catch (error) {
  console.error("Error executing command:", error);
}

// Step 5: Add the original file contents
writeFileSync(configFilePath, fileContent, "utf8");
