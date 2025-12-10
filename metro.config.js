const fs = require("fs");
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { resolve } = require("metro-resolver");

const config = getDefaultConfig(__dirname);
const defaultResolve = config.resolver.resolveRequest;
const hasExpoNotifications = fs.existsSync(
  path.join(__dirname, "node_modules", "expo-notifications")
);

// Si expo-notifications no está instalado (por ejemplo en entornos offline),
// mapeamos el paquete directamente a nuestro shim local para evitar errores
// de resolución en tiempo de carga.
if (!hasExpoNotifications) {
  config.resolver.extraNodeModules = {
    ...(config.resolver.extraNodeModules || {}),
    "expo-notifications": path.resolve(
      __dirname,
      "src/shims/expo-notifications.js"
    ),
  };
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "expo-notifications") {
    try {
      return (defaultResolve || resolve)(context, moduleName, platform);
    } catch (error) {
      return {
        type: "sourceFile",
        filePath: path.resolve(__dirname, "src/shims/expo-notifications.js"),
      };
    }
  }

  return defaultResolve
    ? defaultResolve(context, moduleName, platform)
    : resolve(context, moduleName, platform);
};

module.exports = config;
