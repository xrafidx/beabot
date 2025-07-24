// eslint.config.js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname, // Penting untuk FlatCompat
});

const eslintConfig = [
  ...compat.config({
    extends: [
      "next",
      "next/core-web-vitals", // Ini harus ada di extends jika kamu ingin menggunakannya
      "plugin:@typescript-eslint/recommended", // Tambahkan ini untuk aturan TypeScript ESLint
    ],
    // Tambahkan pengaturan aturan di sini
    rules: {
      // Opsi 1: Menonaktifkan sepenuhnya aturan no-unused-vars
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // Opsi 2: Mengubah no-unused-vars menjadi warning (tidak akan mencegah build)
      // "no-unused-vars": "warn",
      // "@typescript-eslint/no-unused-vars": "warn",

      // Opsi 3: Mengabaikan variabel yang dimulai dengan underscore (rekomendasi umum)
      // Ini akan tetap memberikan error/warning untuk variabel yang tidak digunakan
      // kecuali jika namanya dimulai dengan underscore (misal: _event, _data)
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Jika kamu menggunakan React dan ingin mengizinkan variabel React di JSX scope
      // "react/jsx-uses-vars": "error", // Biasanya sudah ada di preset Next.js
      // "react/react-in-jsx-scope": "off", // Untuk Next.js 13+ tidak perlu import React
    },
  }),
  // Anda mungkin perlu menambahkan konfigurasi untuk file TypeScript secara eksplisit jika belum tercakup
  // Misalnya, jika ada file tsx yang tidak terdeteksi dengan benar
  // {
  //   files: ["**/*.ts", "**/*.tsx"],
  //   languageOptions: {
  //     parser: "@typescript-eslint/parser",
  //     parserOptions: {
  //       project: "./tsconfig.json",
  //     },
  //   },
  //   plugins: {
  //     "@typescript-eslint": {},
  //   },
  // },
];

export default eslintConfig;
