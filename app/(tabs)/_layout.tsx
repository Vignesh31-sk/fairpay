import { Tabs } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { FAB } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/HapticTab";
import { LucideIcon } from "@/components/ui/LucideIcon";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useVoiceProcessing } from "@/hooks/useVoiceProcessing";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const [isListening, setIsListening] = useState(false);
  const { startListening, stopListening, transcript } = useVoiceProcessing();

  const handleVoicePress = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      startListening();
      setIsListening(true);
    }
  };

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
            paddingHorizontal: 60,
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
            marginTop: 6,
          },
          tabBarIconStyle: {
            marginTop: 6,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <LucideIcon 
                size={24} 
                name="home" 
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
          name="wallet"
          options={{
            title: "Wallet",
            tabBarIcon: ({ color, focused }) => (
              <LucideIcon 
                size={24} 
                name="wallet" 
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
        <Tabs.Screen
          name="grievance"
          options={{
            href: null, // This hides the tab from navigation
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            href: null, // This hides the tab from navigation
          }}
        />
        <Tabs.Screen
          name="create-job"
          options={{
            href: null, // This hides the tab from navigation
          }}
        />
      </Tabs>
      
      {/* Global Voice Button */}
      <FAB
        icon={isListening ? "stop" : "microphone"}
        style={[
          styles.voiceButton,
          {
            backgroundColor: isListening ? colors.error : colors.primary,
            bottom: insets.bottom + 44,
          }
        ]}
        onPress={handleVoicePress}
        color={colors.card}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  voiceButton: {
    position: 'absolute',
    left: '50%',
    marginLeft: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
