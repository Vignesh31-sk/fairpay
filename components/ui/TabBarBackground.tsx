import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet, View } from "react-native";

export default function TabBarBackground() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  if (Platform.OS === "ios") {
    return (
      <BlurView
        intensity={80}
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.cardBorder,
          },
        ]}
      />
    );
  }

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.card,
        borderTopWidth: 1,
        borderTopColor: colors.cardBorder,
        elevation: 8,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      }}
    />
  );
}

export function useBottomTabOverflow() {
  return 0;
}
