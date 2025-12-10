const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { resolve } = require("metro-resolver");

const config = getDefaultConfig(__dirname);
const defaultResolve = config.resolver.resolveRequest;

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
