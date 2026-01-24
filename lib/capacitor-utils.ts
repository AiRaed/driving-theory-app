export function isNativeAndroid() {
  if (typeof window === "undefined") return false;
  
  try {
    // Dynamic import to avoid SSR issues
    const { Capacitor } = require("@capacitor/core");
    return Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android";
  } catch {
    return false;
  }
}

