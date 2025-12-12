// Devuelve el módulo real de expo-image-picker si está disponible.
// En entornos offline, usa el shim local para que la app pueda seguir funcionando.
type ImagePickerModule = {
  requestMediaLibraryPermissionsAsync: () => Promise<{
    status: string;
    canAskAgain?: boolean;
    granted?: boolean;
  }>;
  launchImageLibraryAsync: (options: any) => Promise<any>;
  MediaTypeOptions: { Images: string };
};

export function getImagePicker(): ImagePickerModule {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('expo-image-picker');
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('../shims/expo-image-picker');
  }
}
