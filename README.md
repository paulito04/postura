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

## Notificaciones push

La app utiliza `expo-notifications` para programar recordatorios. Si el paquete no está
instalado en tu entorno, Metro detectará su ausencia y usará automáticamente un shim
local (alertas en pantalla) para evitar errores de carga. Para tener notificaciones reales
en segundo plano instala el paquete con `npx expo install expo-notifications`.

## Avatares predeterminados

Los avatares predeterminados viven en `assets/avatars/default/`. Esa carpeta contiene un
`.gitkeep` para mantener la ruta en el repo; agrega ahí tus PNG (`avatar_01.png`, etc.).

Para añadir más avatares:
1. Copia el PNG en `assets/avatars/default/` con el nombre `avatar_XX.png`.
2. Agrega el nuevo `id` en `src/data/avatarCatalog.js`.
3. Declara el `require` correspondiente en `src/data/avatars.js`.

El catálogo valida que haya entre 8 y 20 avatares. Puedes verificarlo con:
`node scripts/validate-avatars.mjs`.
