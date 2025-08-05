import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/HapticTab";
import { LucideIcon } from "@/components/ui/LucideIcon";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.tabIconDefault,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            height: 88,
            paddingBottom: 20,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: colors.cardBorder,
            backgroundColor: colors.card,
            elevation: 8,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            ...Platform.select({
              ios: {
                // Use a transparent background on iOS to show the blur effect
                position: "absolute",
              },
              default: {},
            }),
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Voice Hub",
            tabBarIcon: ({ color, focused }) => (
              <LucideIcon 
                size={24} 
                name="mic.fill" 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="jobs"
          options={{
            title: "Jobs",
            tabBarIcon: ({ color, focused }) => (
              <LucideIcon 
                size={24} 
                name="briefcase.fill" 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: "Analytics",
            tabBarIcon: ({ color, focused }) => (
              <LucideIcon 
                size={24} 
                name="chart.bar.fill" 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="grievance"
          options={{
            title: "Support",
            tabBarIcon: ({ color, focused }) => (
              <LucideIcon
                size={24}
                name="exclamationmark.triangle.fill"
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <LucideIcon 
                size={24} 
                name="person.fill" 
                color={color} 
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
