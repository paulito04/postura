# Postura

Aplicación Expo para mostrar ejercicios y ahora con inicio de sesión mediante Google OAuth.

## Configuración de Google

1. Crea credenciales OAuth en la consola de Google Cloud para los tipos de cliente Web, Android y Expo (para uso con Expo Go).
2. Expone los IDs de cliente como variables de entorno públicas de Expo antes de iniciar la app:
   - `EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID`
   - `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`
   - `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
3. Ejecuta la aplicación con `npm start` o el script correspondiente. El botón de Google se habilitará cuando las tres variables estén configuradas.

La aplicación solicitará los alcances `openid`, `profile` y `email` y mostrará el nombre y correo del usuario tras iniciar sesión.
