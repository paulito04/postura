import { avatarCatalog, DEFAULT_AVATAR_ID } from "../src/data/avatarCatalog.js";

const ids = avatarCatalog.map((avatar) => avatar.id);
const uniqueIds = new Set(ids);

if (avatarCatalog.length < 8 || avatarCatalog.length > 20) {
  throw new Error(`Se esperaban entre 8 y 20 avatares, se encontraron ${avatarCatalog.length}.`);
}

if (uniqueIds.size !== ids.length) {
  throw new Error("Hay IDs de avatar duplicados en el catálogo.");
}

if (!uniqueIds.has(DEFAULT_AVATAR_ID)) {
  throw new Error("El avatar predeterminado no existe en el catálogo.");
}

console.log("✔ Catálogo de avatares válido.");
