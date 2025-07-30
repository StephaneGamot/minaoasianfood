import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
{
    ignores: [
      "**/node_modules/**",
      ".next/",
      "dist/",
      "public/",
      "**/*.config.js", // (si tu veux ignorer tes fichiers de config)
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ✅ Règle spécifique aux fichiers générés par Prisma
  {
    files: ["src/generated/prisma/*.js"],
    languageOptions: {
      sourceType: "commonjs", // facultatif mais explicite
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];

export default eslintConfig;
