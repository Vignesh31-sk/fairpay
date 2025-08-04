import { ConfigContext, ExpoConfig } from "expo/config";
import { version } from "./package.json";

// https://github.com/betomoedano/with-environments/blob/main/app.config.ts

const EAS_PROJECT_ID = "2c12ca5f-0315-43b8-a46f-ed23c43e17a4";
const OWNER = "grandmaster_subsero";

// App production config
const APP_NAME = "fairpay";
const PROJECT_SLUG = "fairpay";
const BUNDLE_IDENTIFIER = "com.company.fairpay";
const PACKAGE_NAME = "com.company.fairpay";
const ICON = "./assets/images/icon.png";
const FAVICON = "./assets/images/favicon.png";
const ADAPTIVE_ICON = "./assets/images/adaptive-icon.png";
const SCHEME = "fairpay";

export default ({ config }: ConfigContext): ExpoConfig => {
  console.log("⚙️ Building app for environment:", process.env.APP_ENV);
  console.log("📦 ", process.env.NODE_ENV);

  const { name, bundleIdentifier, icon, adaptiveIcon, packageName, scheme } =
    getDynamicAppConfig(
      (process.env.APP_ENV as "development" | "preview" | "production") ||
        "development"
    );

  return {
    ...config,
    name: name,
    slug: PROJECT_SLUG, // Must be consistent across all environments.
    version, // Automatically bump your project version with `npm version patch`, `npm version minor` or `npm version major`.
    orientation: "portrait",
    icon: icon,
    scheme: scheme,
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: adaptiveIcon,
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: packageName,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: FAVICON,
    },
    extra: {
      eas: {
        projectId: EAS_PROJECT_ID,
      },

      //   appName: APP_NAME,
      //   bundleIdentifier: bundleIdentifier,
      //   packageName: packageName,
      //   icon: icon,
      //   adaptiveIcon: adaptiveIcon,
      //   scheme: scheme,
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-audio",
        {
          microphonePermission: `Allow  ${APP_NAME} to access your microphone.`,
        },
      ],
      [
        "expo-speech-recognition",
        {
          microphonePermission: "Allow $(PRODUCT_NAME) to use the microphone.",
          speechRecognitionPermission:
            "Allow $(PRODUCT_NAME) to use speech recognition.",
          androidSpeechServicePackages: [
            "com.google.android.googlequicksearchbox",
          ],
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    owner: OWNER,
  };
};

// Dynamically configure the app based on the environment.
export const getDynamicAppConfig = (
  environment: "development" | "preview" | "production"
) => {
  if (environment === "production") {
    return {
      name: APP_NAME,
      bundleIdentifier: BUNDLE_IDENTIFIER,
      packageName: PACKAGE_NAME,
      icon: ICON,
      adaptiveIcon: ADAPTIVE_ICON,
      scheme: SCHEME,
    };
  }

  if (environment === "preview") {
    return {
      name: `${APP_NAME} Preview`,
      bundleIdentifier: `${BUNDLE_IDENTIFIER}.preview`,
      packageName: `${PACKAGE_NAME}.preview`,
      icon: ICON,
      adaptiveIcon: ADAPTIVE_ICON,
      scheme: `${SCHEME}-prev`,
    };
  }

  return {
    name: `${APP_NAME} Development`,
    bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
    packageName: `${PACKAGE_NAME}.dev`,
    icon: ICON,
    adaptiveIcon: ADAPTIVE_ICON,
    scheme: `${SCHEME}-dev`,
  };
};
