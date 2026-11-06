"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// seed-default-user.ts
var import_bcryptjs = __toESM(require("bcryptjs"), 1);

// src/lib/prisma.ts
var import_adapter_better_sqlite3 = require("@prisma/adapter-better-sqlite3");
var import_client = require("@prisma/client");
var adapter = new import_adapter_better_sqlite3.PrismaBetterSqlite3({ url: "file:./dev.db" });
var prisma = new import_client.PrismaClient({ adapter });

// seed-default-user.ts
async function seedDefaultUser() {
  const existingDefaultUser = await prisma.user.findUnique({
    where: {
      email: "sistema@empresa.com"
    }
  });
  if (!existingDefaultUser) {
    console.log("Default user not found.");
    return null;
  }
  try {
    const result = await prisma.item.updateMany({
      where: {
        userId: null
      },
      data: {
        userId: existingDefaultUser.id
      }
    });
    console.log(`Updated ${result.count} items with default user ID.`);
  } catch (error) {
    console.error("Error updating items with default user ID:", error);
  }
}
async function insertDefaultUser() {
  const defaultUser = {
    name: "Default User",
    email: "sistema@empresa.com",
    passwordHash: await import_bcryptjs.default.hash("defaultpassword", 10),
    createdAt: /* @__PURE__ */ new Date()
  };
  await prisma.user.create({
    data: defaultUser
  });
}
async function main() {
  await insertDefaultUser();
  await seedDefaultUser();
}
main();
