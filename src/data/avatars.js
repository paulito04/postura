import { avatarCatalog, DEFAULT_AVATAR_ID, isValidAvatarId } from "./avatarCatalog";

// Sustituye estos nombres por requires locales cuando tengas las imágenes en assets/avatars/default.
const avatarAssets = {
  avatar_01: "avatar_01.png",
  avatar_02: "avatar_02.png",
  avatar_03: "avatar_03.png",
  avatar_04: "avatar_04.png",
  avatar_05: "avatar_05.png",
  avatar_06: "avatar_06.png",
  avatar_07: "avatar_07.png",
  avatar_08: "avatar_08.png",
};

export const defaultAvatars = avatarCatalog.map((avatar) => ({
  ...avatar,
  assetName: avatarAssets[avatar.id],
  source: null,
}));

export const getAvatarSource = (avatarId) => {
  if (!avatarId || !isValidAvatarId(avatarId)) {
    return null;
  }

  return null;
};

export { DEFAULT_AVATAR_ID, isValidAvatarId };
