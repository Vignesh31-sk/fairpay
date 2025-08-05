import { ThemedView } from "@/components/ThemedView";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useVoiceProcessing } from "@/hooks/useVoiceProcessing";
import React from "react";
import { Alert, Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Avatar, Card, FAB, Text } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  
  const {
    isListening,
    transcript,
    isProcessing,
    startListening,
    stopListening,
  } = useVoiceProcessing();

  const quickActions = [
    {
      title: "Find Jobs",
      subtitle: "Search for available positions",
      icon: "briefcase.fill",
      color: colors.primary,
      action: () => Alert.alert("Voice Command", 'Try saying "Show me jobs"'),
    },
    {
      title: "My Profile",
      subtitle: "View and edit your profile",
      icon: "person.fill",
      color: colors.secondary,
      action: () => Alert.alert("Voice Command", 'Try saying "Go to profile"'),
    },
    {
      title: "Analytics",
      subtitle: "View your earnings and stats",
      icon: "chart.bar.fill",
      color: colors.accent,
      action: () => Alert.alert("Voice Command", 'Try saying "Open analytics"'),
    },
    {
      title: "File Complaint",
      subtitle: "Report issues or grievances",
      icon: "exclamationmark.triangle.fill",
      color: colors.warning,
      action: () => Alert.alert("Voice Command", 'Try saying "File a complaint"'),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
  <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>


        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text variant="headlineSmall" style={[styles.greeting, { color: colors.text }]}>
                  Good morning, Worker
                </Text>
                <Text variant="titleMedium" style={[styles.welcomeText, { color: colors.textSecondary }]}>
                  Welcome to FairPay
                </Text>
              </View>
              <Avatar.Icon 
                size={40} 
                icon="bell-outline" 
                style={{ backgroundColor: colors.backgroundSecondary }}
                color={colors.icon}
              />
            </View>
          </View>

          {/* Voice Assistant Card */}
          <Card style={[styles.voiceCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Card.Content style={styles.voiceCardContent}>
              <View style={styles.voiceHeader}>
                <LucideIcon size={24} name="mic.fill" color={colors.primary} />
                <Text variant="titleMedium" style={[styles.voiceTitle, { color: colors.text }]}>
                  Voice Assistant
                </Text>
              </View>
              
              <View style={styles.voiceStatus}>
                {isListening && (
                  <ActivityIndicator
                    size="large"
                    color={colors.primary}
                    style={styles.listeningIndicator}
                  />
                )}
                <Text variant="bodyLarge" style={[styles.voiceStatusText, { color: colors.textSecondary }]}>
                  {isListening
                    ? "Listening..."
                    : isProcessing
                    ? "Processing..."
                    : "Ready to help you"}
                </Text>
                {transcript ? (
                  <Text variant="bodyMedium" style={[styles.transcript, { color: colors.primary }]}>
                    &ldquo;{transcript}&rdquo;
                  </Text>
                ) : null}
              </View>

              {/* Voice Button */}
              <View style={styles.micContainer}>
                <FAB
                  icon={isListening ? "stop" : "microphone"}
                  size="large"
                  style={[
                    styles.micButton, 
                    { backgroundColor: isListening ? colors.error : colors.primary },
                    isListening && styles.micButtonActive
                  ]}
                  onPress={isListening ? stopListening : startListening}
                  disabled={isProcessing}
                />
                <Text variant="bodySmall" style={[styles.micLabel, { color: colors.textTertiary }]}>
                  {isListening ? "Tap to stop" : "Tap to speak"}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Quick Actions Grid */}
          <View style={styles.quickActionsContainer}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
              Quick Actions
            </Text>
            <View style={styles.actionsGrid}>
              {quickActions.map((action, index) => (
                <Card 
                  key={index} 
                  style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                  onPress={action.action}
                >
                  <Card.Content style={styles.actionCardContent}>
                    <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                      <LucideIcon size={24} name={action.icon} color={action.color} />
                    </View>
                    <Text variant="titleSmall" style={[styles.actionTitle, { color: colors.text }]}>
                      {action.title}
                    </Text>
                    <Text variant="bodySmall" style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                      {action.subtitle}
                    </Text>
                  </Card.Content>
                </Card>
              ))}
            </View>
          </View>

          {/* Help Section */}
          <Card style={[styles.helpCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder }]}>
            <Card.Content>
              <View style={styles.helpHeader}>
                <LucideIcon size={24} name="questionmark.circle.fill" color={colors.primary} />
                <Text variant="titleMedium" style={[styles.helpTitle, { color: colors.text }]}>
                  How to Use Voice Commands
                </Text>
              </View>
              <View style={styles.helpSteps}>
                <View style={styles.helpStep}>
                  <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.stepNumberText, { color: colors.card }]}>1</Text>
                  </View>
                  <Text variant="bodyMedium" style={[styles.helpText, { color: colors.textSecondary }]}>
                    Tap the microphone button
                  </Text>
                </View>
                <View style={styles.helpStep}>
                  <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.stepNumberText, { color: colors.card }]}>2</Text>
                  </View>
                  <Text variant="bodyMedium" style={[styles.helpText, { color: colors.textSecondary }]}>
                    Speak clearly in Hindi or English
                  </Text>
                </View>
                <View style={styles.helpStep}>
                  <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.stepNumberText, { color: colors.card }]}>3</Text>
                  </View>
                  <Text variant="bodyMedium" style={[styles.helpText, { color: colors.textSecondary }]}>
                    Wait for processing and navigation
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontWeight: '600',
    marginBottom: 4,
  },
  welcomeText: {
    fontWeight: '400',
  },
  voiceCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  voiceCardContent: {
    padding: 20,
  },
  voiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  voiceTitle: {
    fontWeight: '600',
    marginLeft: 8,
  },
  voiceStatus: {
    alignItems: 'center',
    marginBottom: 20,
  },
  listeningIndicator: {
    marginBottom: 8,
  },
  voiceStatusText: {
    fontWeight: '500',
    marginBottom: 8,
  },
  transcript: {
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: '500',
  },
  micContainer: {
    alignItems: 'center',
  },
  micButton: {
    marginBottom: 8,
  },
  micButtonActive: {
    transform: [{ scale: 1.1 }],
  },
  micLabel: {
    fontWeight: '500',
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  actionCardContent: {
    padding: 16,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    textAlign: 'center',
    lineHeight: 16,
  },
  helpCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  helpTitle: {
    fontWeight: '600',
    marginLeft: 8,
  },
  helpSteps: {
    gap: 12,
  },
  helpStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '600',
  },
  helpText: {
    flex: 1,
    lineHeight: 20,
  },
});
