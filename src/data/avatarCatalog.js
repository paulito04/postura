export const DEFAULT_AVATAR_ID = "avatar_01";

export const avatarCatalog = [
  { id: "avatar_01", label: "Avatar 01" },
  { id: "avatar_02", label: "Avatar 02" },
  { id: "avatar_03", label: "Avatar 03" },
  { id: "avatar_04", label: "Avatar 04" },
  { id: "avatar_05", label: "Avatar 05" },
  { id: "avatar_06", label: "Avatar 06" },
  { id: "avatar_07", label: "Avatar 07" },
  { id: "avatar_08", label: "Avatar 08" },
];

export const isValidAvatarId = (avatarId) =>
  avatarCatalog.some((avatar) => avatar.id === avatarId);
