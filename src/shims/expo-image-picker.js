let warned = false;

function warnIfUsingShim() {
  if (!warned) {
    warned = true;
    console.warn(
      "expo-image-picker no está instalado; usando shim local sin selector de imágenes."
    );
  }
}

export const MediaTypeOptions = {
  Images: "Images",
};

export async function requestMediaLibraryPermissionsAsync() {
  warnIfUsingShim();
  return { status: "granted", canAskAgain: true, granted: true };
}

export async function launchImageLibraryAsync() {
  warnIfUsingShim();
  return { canceled: true, assets: [] };
}
