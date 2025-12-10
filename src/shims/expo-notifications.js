import { Alert } from "react-native";

let scheduledTimeout = null;
let warned = false;

function warnIfUsingShim() {
  if (!warned) {
    warned = true;
    console.warn(
      "expo-notifications no está instalado; usando shim local sin notificaciones de sistema."
    );
  }
}

export async function getPermissionsAsync() {
  warnIfUsingShim();
  return {
    status: "granted",
    canAskAgain: true,
    granted: true,
  };
}

export async function requestPermissionsAsync() {
  warnIfUsingShim();
  return getPermissionsAsync();
}

export async function cancelAllScheduledNotificationsAsync() {
  warnIfUsingShim();
  if (scheduledTimeout) {
    clearTimeout(scheduledTimeout);
    scheduledTimeout = null;
  }
}

export async function scheduleNotificationAsync({ content, trigger }) {
  warnIfUsingShim();
  const now = Date.now();
  const triggerMs =
    trigger instanceof Date
      ? trigger.getTime() - now
      : typeof trigger === "number"
      ? trigger
      : 0;

  await cancelAllScheduledNotificationsAsync();

  const delay = Math.max(triggerMs || 0, 0);
  scheduledTimeout = setTimeout(() => {
    const title = content?.title ?? "Notificación";
    const body = content?.body ?? "";

    if (title || body) {
      Alert.alert(title, body);
    }
  }, delay);

  return { identifier: String(scheduledTimeout) };
}
