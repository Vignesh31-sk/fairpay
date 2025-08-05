import { LucideIcon } from "@/components/ui/LucideIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useVoiceProcessing } from "@/hooks/useVoiceProcessing";
import React, { useState } from "react";
import { Alert, Modal, StyleSheet, View } from "react-native";
import { ActivityIndicator, FAB, Text } from "react-native-paper";

interface VoiceButtonProps {
  onVoiceCommand?: (command: string) => void;
}

export default function VoiceButton({ onVoiceCommand }: VoiceButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const {
    isListening,
    transcript,
    isProcessing,
    startListening,
    stopListening,
  } = useVoiceProcessing();

  const handleVoicePress = () => {
    if (isListening) {
      stopListening();
      setIsModalVisible(false);
    } else {
      startListening();
      setIsModalVisible(true);
    }
  };

  const handleVoiceCommand = (command: string) => {
    // Process voice commands
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('home') || lowerCommand.includes('main')) {
      Alert.alert("Voice Command", "Navigating to Home");
    } else if (lowerCommand.includes('job') || lowerCommand.includes('work')) {
      Alert.alert("Voice Command", "Navigating to Jobs");
    } else if (lowerCommand.includes('wallet') || lowerCommand.includes('money')) {
      Alert.alert("Voice Command", "Navigating to Wallet");
    } else if (lowerCommand.includes('profile') || lowerCommand.includes('account')) {
      Alert.alert("Voice Command", "Navigating to Profile");
    } else if (lowerCommand.includes('help') || lowerCommand.includes('support')) {
      Alert.alert("Voice Command", "Navigating to Support");
    } else {
      Alert.alert("Voice Command", `Command: ${command}`);
    }
    
    onVoiceCommand?.(command);
  };

  return (
    <>
      {/* Floating Voice Button */}
      <FAB
        icon={isListening ? "stop" : "microphone"}
        size="large"
        style={[
          styles.voiceButton, 
          { 
            backgroundColor: isListening ? colors.error : colors.primary,
            elevation: 8,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }
        ]}
        onPress={handleVoicePress}
        disabled={isProcessing}
      />

      {/* Voice Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <LucideIcon size={24} name="mic.fill" color={colors.primary} />
              <Text variant="titleMedium" style={[styles.modalTitle, { color: colors.text }]}>
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

            <View style={styles.voiceCommands}>
              <Text variant="titleSmall" style={[styles.commandsTitle, { color: colors.text }]}>
                Try saying:
              </Text>
              <View style={styles.commandList}>
                <Text variant="bodySmall" style={[styles.commandItem, { color: colors.textSecondary }]}>
                  • "Go to Home"
                </Text>
                <Text variant="bodySmall" style={[styles.commandItem, { color: colors.textSecondary }]}>
                  • "Show me Jobs"
                </Text>
                <Text variant="bodySmall" style={[styles.commandItem, { color: colors.textSecondary }]}>
                  • "Open Wallet"
                </Text>
                <Text variant="bodySmall" style={[styles.commandItem, { color: colors.textSecondary }]}>
                  • "My Profile"
                </Text>
              </View>
            </View>

            <FAB
              icon={isListening ? "stop" : "microphone"}
              size="large"
              style={[
                styles.modalMicButton, 
                { backgroundColor: isListening ? colors.error : colors.primary }
              ]}
              onPress={handleVoicePress}
              disabled={isProcessing}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  voiceButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 1000,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontWeight: '600',
    marginLeft: 8,
  },
  voiceStatus: {
    alignItems: 'center',
    marginBottom: 24,
  },
  listeningIndicator: {
    marginBottom: 12,
  },
  voiceStatusText: {
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  transcript: {
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 8,
  },
  voiceCommands: {
    alignItems: 'center',
    marginBottom: 24,
  },
  commandsTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  commandList: {
    alignItems: 'center',
  },
  commandItem: {
    marginBottom: 4,
    textAlign: 'center',
  },
  modalMicButton: {
    marginTop: 8,
  },
}); 