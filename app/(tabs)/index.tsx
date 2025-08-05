import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useVoiceProcessing } from "@/hooks/useVoiceProcessing";
import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { ActivityIndicator, Card, FAB, Text } from "react-native-paper";

export default function HomeScreen() {
  const {
    isListening,
    transcript,
    isProcessing,
    startListening,
    stopListening,
  } = useVoiceProcessing();

  const quickActions = [
    {
      title: "View Jobs",
      subtitle: 'Say: "Show me jobs"',
      action: () => Alert.alert("Voice Command", 'Try saying "Show me jobs"'),
    },
    {
      title: "Search Jobs",
      subtitle: 'Say: "Search for electrician jobs"',
      action: () =>
        Alert.alert(
          "Voice Command",
          'Try saying "Search for electrician jobs"'
        ),
    },
    {
      title: "View Profile",
      subtitle: 'Say: "Go to profile"',
      action: () => Alert.alert("Voice Command", 'Try saying "Go to profile"'),
    },
    {
      title: "File Grievance",
      subtitle: 'Say: "File a complaint"',
      action: () =>
        Alert.alert("Voice Command", 'Try saying "File a complaint"'),
    },
    {
      title: "Analytics",
      subtitle: 'Say: "Open analytics"',
      action: () => Alert.alert("Voice Command", 'Try saying "Open analytics"'),
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        FairPay Voice Hub
      </ThemedText>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Welcome! Use voice commands to navigate
      </Text>

      {/* Voice Status Card */}
      <Card style={styles.voiceCard}>
        <Card.Content>
          <View style={styles.voiceStatus}>
            {isListening && (
              <ActivityIndicator
                size="large"
                color="#6200ea"
                style={styles.listeningIndicator}
              />
            )}
            <Text variant="titleMedium" style={styles.voiceTitle}>
              {isListening
                ? "Listening..."
                : isProcessing
                ? "Processing..."
                : "Ready to Listen"}
            </Text>
            {transcript ? (
              <Text variant="bodyMedium" style={styles.transcript}>
                &ldquo;{transcript}&rdquo;
              </Text>
            ) : null}
          </View>
        </Card.Content>
      </Card>

      {/* Main Voice Button */}
      <View style={styles.micContainer}>
        <FAB
          icon={isListening ? "stop" : "microphone"}
          size="large"
          style={[styles.micButton, isListening && styles.micButtonActive]}
          onPress={isListening ? stopListening : startListening}
          disabled={isProcessing}
        />
        <Text variant="bodyMedium" style={styles.micLabel}>
          {isListening ? "Tap to stop" : "Tap to speak"}
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text variant="titleMedium" style={styles.quickActionsTitle}>
          Quick Actions (Try these voice commands)
        </Text>
        {quickActions.map((action, index) => (
          <Card key={index} style={styles.actionCard}>
            <Card.Content>
              <Text variant="titleSmall" style={styles.actionTitle}>
                {action.title}
              </Text>
              <Text variant="bodySmall" style={styles.actionSubtitle}>
                {action.subtitle}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Help Card */}
      <Card style={styles.helpCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.helpTitle}>
            How to Use
          </Text>
          <Text variant="bodyMedium" style={styles.helpText}>
            1. Tap the microphone button above{"\n"}
            2. Speak clearly in Hindi or English{"\n"}
            3. Wait for the command to be processed{"\n"}
            4. Navigate automatically to the requested screen
          </Text>
        </Card.Content>
      </Card>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 8,
    textAlign: "center",
    color: "#6200ea",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 24,
  },
  voiceCard: {
    marginBottom: 24,
    backgroundColor: "#f5f5f5",
  },
  voiceStatus: {
    alignItems: "center",
    padding: 16,
  },
  listeningIndicator: {
    marginBottom: 8,
  },
  voiceTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  transcript: {
    fontStyle: "italic",
    textAlign: "center",
    color: "#6200ea",
  },
  micContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  micButton: {
    backgroundColor: "#6200ea",
    marginBottom: 8,
  },
  micButtonActive: {
    backgroundColor: "#f44336",
  },
  micLabel: {
    color: "#666",
  },
  quickActionsContainer: {
    marginBottom: 20,
  },
  quickActionsTitle: {
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  actionCard: {
    marginBottom: 8,
  },
  actionTitle: {
    fontWeight: "500",
    marginBottom: 4,
  },
  actionSubtitle: {
    color: "#666",
    fontStyle: "italic",
  },
  helpCard: {
    backgroundColor: "#e8f5e8",
  },
  helpTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2e7d32",
  },
  helpText: {
    color: "#2e7d32",
    lineHeight: 20,
  },
});
