import { ThemedView } from "@/components/ThemedView";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { Colors } from "@/constants/Colors";
import { DUMMY_GRIEVANCES } from "@/constants/Data";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Grievance } from "@/types";
import { router } from "expo-router";
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import React, { useState } from "react";
import { Alert, FlatList, ScrollView, StyleSheet, View } from "react-native";
import {
    Avatar,
    Badge,
    Button,
    Card,
    Chip,
    FAB,
    Menu,
    Modal,
    Portal,
    Text,
    TextInput,
} from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function GrievanceScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  
  const [grievances, setGrievances] = useState<Grievance[]>(DUMMY_GRIEVANCES);
  const [modalVisible, setModalVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [newGrievance, setNewGrievance] = useState({
    title: "",
    description: "",
    category: "other" as Grievance["category"],
    urgency: "normal" as Grievance["urgency"],
  });
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [urgencyMenuVisible, setUrgencyMenuVisible] = useState(false);

  const categories = [
    { label: "Payment Issue", value: "payment_issue", icon: "indianrupeesign.circle.fill", color: colors.warning },
    { label: "Job Mismatch", value: "job_mismatch", icon: "briefcase.fill", color: colors.secondary },
    { label: "Workplace Safety", value: "workplace_safety", icon: "shield.fill", color: colors.error },
    { label: "Harassment", value: "harassment", icon: "exclamationmark.triangle.fill", color: colors.error },
    { label: "Other", value: "other", icon: "questionmark.circle.fill", color: colors.textSecondary },
  ];

  const urgencyLevels = [
    { label: "Normal", value: "normal", color: colors.textSecondary },
    { label: "Urgent", value: "urgent", color: colors.error },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return colors.warning;
      case "in_progress":
        return colors.secondary;
      case "resolved":
        return colors.success;
      case "closed":
        return colors.textTertiary;
      default:
        return colors.textTertiary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "clock.fill";
      case "in_progress":
        return "arrow.triangle.2.circlepath";
      case "resolved":
        return "checkmark.circle.fill";
      case "closed":
        return "xmark.circle.fill";
      default:
        return "questionmark.circle.fill";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    return urgency === "urgent" ? colors.error : colors.textSecondary;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleVoiceRecord = async () => {
    if (!isRecording) {
      try {
        // Request permissions
        const { granted } =
          await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!granted) {
          Alert.alert(
            "Permission required",
            "Please enable microphone permissions to record voice notes."
          );
          return;
        }

        // Start recording
        setIsRecording(true);
        setVoiceTranscript("");

        await ExpoSpeechRecognitionModule.start({
          lang: "en-US", // You can change this to 'hi-IN' for Hindi
          interimResults: true,
          maxAlternatives: 1,
          continuous: false,
          requiresOnDeviceRecognition: false,
        });
      } catch (error) {
        console.error("Failed to start voice recognition:", error);
        Alert.alert(
          "Error",
          "Failed to start voice recording. Please try again."
        );
        setIsRecording(false);
      }
    } else {
      // Stop recording
      try {
        await ExpoSpeechRecognitionModule.stop();
        setIsRecording(false);
      } catch (error) {
        console.error("Failed to stop voice recognition:", error);
        setIsRecording(false);
      }
    }
  };

  // Speech recognition event listeners - only active during grievance recording
  useSpeechRecognitionEvent("start", () => {
    if (modalVisible && isRecording) {
      setIsRecording(true);
    }
  });

  useSpeechRecognitionEvent("result", (event) => {
    // Only process results if we're in the grievance modal and actively recording
    if (!modalVisible || !isRecording) {
      return;
    }

    const recognizedText = event.results[0]?.transcript || "";
    setVoiceTranscript(recognizedText);

    if (event.isFinal) {
      // Add the voice note to description
      setNewGrievance((prev) => ({
        ...prev,
        description: prev.description
          ? prev.description + "\n\n[Voice Note]: " + recognizedText
          : "[Voice Note]: " + recognizedText,
      }));

      setIsRecording(false);
      Alert.alert("Success", "Voice note recorded and added to description!");
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    // Only handle errors if we're actively recording in the grievance modal
    if (!modalVisible || !isRecording) {
      return;
    }

    console.error("Speech recognition error:", event.error);
    Alert.alert("Voice Recognition Error", "Please try again.");
    setIsRecording(false);
  });

  useSpeechRecognitionEvent("end", () => {
    if (modalVisible && isRecording) {
      setIsRecording(false);
    }
  });

  const handleSubmitGrievance = () => {
    if (!newGrievance.title.trim() || !newGrievance.description.trim()) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    const grievance: Grievance = {
      id: (grievances.length + 1).toString(),
      title: newGrievance.title,
      description: newGrievance.description,
      category: newGrievance.category,
      urgency: newGrievance.urgency,
      status: "pending",
      timestamp: new Date().toISOString(),
    };

    setGrievances([grievance, ...grievances]);
    setModalVisible(false);
    setNewGrievance({
      title: "",
      description: "",
      category: "other",
      urgency: "normal",
    });
    setVoiceTranscript(""); // Clear voice transcript
    setIsRecording(false); // Ensure recording is stopped

    Alert.alert("Success", "Your grievance has been submitted successfully.");
  };

  const renderGrievance = ({ item }: { item: Grievance }) => {
    const category = categories.find((cat) => cat.value === item.category);
    return (
      <Card style={[styles.grievanceCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Card.Content style={styles.grievanceCardContent}>
          <View style={styles.grievanceHeader}>
            <View style={styles.grievanceTitleContainer}>
              <Text variant="titleMedium" style={[styles.grievanceTitle, { color: colors.text }]}>
                {item.title}
              </Text>
              <View style={styles.grievanceBadges}>
                {item.urgency === "urgent" && (
                  <Badge style={[styles.urgentBadge, { backgroundColor: colors.error }]}>
                    Urgent
                  </Badge>
                )}
                <Chip
                  mode="outlined"
                  compact
                  style={[styles.urgencyChip, { borderColor: getUrgencyColor(item.urgency) }]}
                  textStyle={{ color: getUrgencyColor(item.urgency) }}
                >
                  {item.urgency.toUpperCase()}
                </Chip>
              </View>
            </View>
            <Avatar.Icon 
              size={40} 
              icon={category?.icon || "questionmark.circle.fill"}
              style={{ backgroundColor: (category?.color || colors.textSecondary) + '20' }}
              color={category?.color || colors.textSecondary}
            />
          </View>

          <View style={styles.categoryRow}>
            <LucideIcon size={16} name="tag.fill" color={colors.textSecondary} />
            <Text variant="bodySmall" style={[styles.category, { color: category?.color || colors.textSecondary }]}>
              {category?.label}
            </Text>
          </View>

          <Text variant="bodyMedium" style={[styles.description, { color: colors.textSecondary }]} numberOfLines={3}>
            {item.description}
          </Text>

          <View style={styles.grievanceFooter}>
            <View style={styles.dateRow}>
              <LucideIcon size={16} name="calendar" color={colors.textTertiary} />
              <Text variant="bodySmall" style={[styles.date, { color: colors.textTertiary }]}>
                {formatDate(item.timestamp)}
              </Text>
            </View>
            <View style={styles.statusContainer}>
              <LucideIcon size={16} name={getStatusIcon(item.status)} color={getStatusColor(item.status)} />
              <Chip
                mode="flat"
                compact
                style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) + '20' }]}
                textStyle={{ color: getStatusColor(item.status) }}
              >
                {item.status.replace("_", " ").toUpperCase()}
              </Chip>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
       <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                                 <Avatar.Icon 
                   size={32} 
                   icon="chevron-left" 
                   style={{ backgroundColor: colors.backgroundSecondary }}
                   color={colors.text}
                   onTouchEnd={() => router.back()}
                 />
                               <View style={styles.headerTextContainer}>
                 <Text variant="headlineSmall" style={[styles.headerTitle, { color: colors.text }]}>
                   Support & Grievances
                 </Text>
                 <Text variant="titleMedium" style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                   {grievances.length} grievances filed
                 </Text>
               </View>
             </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
              Quick Actions
            </Text>
            <View style={styles.quickActionsGrid}>
              <Card 
                style={[styles.quickActionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                onPress={() => setModalVisible(true)}
              >
                <Card.Content style={styles.quickActionContent}>
                  <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '20' }]}>
                    <LucideIcon size={24} name="plus.circle.fill" color={colors.primary} />
                  </View>
                  <Text variant="titleSmall" style={[styles.quickActionTitle, { color: colors.text }]}>
                    File New Grievance
                  </Text>
                  <Text variant="bodySmall" style={[styles.quickActionSubtitle, { color: colors.textSecondary }]}>
                    Report an issue or concern
                  </Text>
                </Card.Content>
              </Card>

              <Card 
                style={[styles.quickActionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                onPress={() => Alert.alert("Help", "Contact support at support@fairpay.com")}
              >
                <Card.Content style={styles.quickActionContent}>
                  <View style={[styles.quickActionIcon, { backgroundColor: colors.secondary + '20' }]}>
                    <LucideIcon size={24} name="questionmark.circle.fill" color={colors.secondary} />
                  </View>
                  <Text variant="titleSmall" style={[styles.quickActionTitle, { color: colors.text }]}>
                    Get Help
                  </Text>
                  <Text variant="bodySmall" style={[styles.quickActionSubtitle, { color: colors.textSecondary }]}>
                    Contact support team
                  </Text>
                </Card.Content>
              </Card>
            </View>
          </View>

          {/* Grievances List */}
          <View style={styles.grievancesContainer}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
              Your Grievances
            </Text>
            <FlatList
              data={grievances}
              renderItem={renderGrievance}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              contentContainerStyle={styles.grievancesList}
              ListEmptyComponent={
                <Card style={[styles.emptyCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder }]}>
                  <Card.Content style={styles.emptyContent}>
                    <LucideIcon size={48} name="checkmark.shield" color={colors.textTertiary} />
                    <Text variant="titleMedium" style={[styles.emptyText, { color: colors.text }]}>
                      No grievances filed
                    </Text>
                    <Text variant="bodyMedium" style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                      Use the button below to file your first grievance
                    </Text>
                  </Card.Content>
                </Card>
              }
            />
          </View>
        </ScrollView>

        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => setModalVisible(true)}
          label="File Grievance"
        />

        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => {
              setModalVisible(false);
              setVoiceTranscript("");
              setIsRecording(false);
            }}
            contentContainerStyle={[styles.modal, { backgroundColor: colors.card }]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <LucideIcon size={24} name="exclamationmark.triangle.fill" color={colors.warning} />
                <Text variant="titleLarge" style={[styles.modalTitle, { color: colors.text }]}>
                  File a Grievance
                </Text>
              </View>

              <TextInput
                label="Title *"
                value={newGrievance.title}
                onChangeText={(text) =>
                  setNewGrievance((prev) => ({ ...prev, title: text }))
                }
                mode="outlined"
                style={[styles.input, { backgroundColor: colors.backgroundSecondary }]}
                textColor={colors.text}
                placeholderTextColor={colors.textTertiary}
              />

              <View style={styles.menuContainer}>
                <Menu
                  visible={categoryMenuVisible}
                  onDismiss={() => setCategoryMenuVisible(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setCategoryMenuVisible(true)}
                      style={[styles.menuButton, { borderColor: colors.cardBorder }]}
                      textColor={colors.text}
                    >
                      Category:{" "}
                      {
                        categories.find(
                          (cat) => cat.value === newGrievance.category
                        )?.label
                      }
                    </Button>
                  }
                >
                  {categories.map((category) => (
                    <Menu.Item
                      key={category.value}
                      onPress={() => {
                        setNewGrievance((prev) => ({
                          ...prev,
                          category: category.value as Grievance["category"],
                        }));
                        setCategoryMenuVisible(false);
                      }}
                      title={category.label}
                    />
                  ))}
                </Menu>
              </View>

              <View style={styles.menuContainer}>
                <Menu
                  visible={urgencyMenuVisible}
                  onDismiss={() => setUrgencyMenuVisible(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setUrgencyMenuVisible(true)}
                      style={[styles.menuButton, { borderColor: colors.cardBorder }]}
                      textColor={colors.text}
                    >
                      Urgency:{" "}
                      {
                        urgencyLevels.find(
                          (level) => level.value === newGrievance.urgency
                        )?.label
                      }
                    </Button>
                  }
                >
                  {urgencyLevels.map((level) => (
                    <Menu.Item
                      key={level.value}
                      onPress={() => {
                        setNewGrievance((prev) => ({
                          ...prev,
                          urgency: level.value as Grievance["urgency"],
                        }));
                        setUrgencyMenuVisible(false);
                      }}
                      title={level.label}
                    />
                  ))}
                </Menu>
              </View>

              <View style={styles.voiceContainer}>
                <Button
                  mode={isRecording ? "contained" : "outlined"}
                  icon={isRecording ? "stop" : "microphone"}
                  onPress={handleVoiceRecord}
                  style={[
                    styles.voiceButton,
                    isRecording && styles.recordingButton,
                    { borderColor: colors.cardBorder }
                  ]}
                  buttonColor={isRecording ? colors.error : undefined}
                  textColor={isRecording ? colors.card : colors.text}
                >
                  {isRecording
                    ? "🔴 Recording... Tap to Stop"
                    : "🎤 Record Voice Note"}
                </Button>
                {isRecording && (
                  <View style={styles.transcriptContainer}>
                    <Text variant="bodySmall" style={[styles.recordingText, { color: colors.error }]}>
                      Speak clearly. Tap the button above to stop recording.
                    </Text>
                    {voiceTranscript ? (
                      <View style={[styles.liveTranscript, { backgroundColor: colors.backgroundSecondary, borderLeftColor: colors.primary }]}>
                        <Text variant="bodySmall" style={[styles.transcriptLabel, { color: colors.textSecondary }]}>
                          Live transcript:
                        </Text>
                        <Text variant="bodyMedium" style={[styles.transcriptText, { color: colors.text }]}>
                          &ldquo;{voiceTranscript}&rdquo;
                        </Text>
                      </View>
                    ) : null}
                  </View>
                )}
              </View>

              <TextInput
                label="Description *"
                value={newGrievance.description}
                onChangeText={(text) =>
                  setNewGrievance((prev) => ({ ...prev, description: text }))
                }
                mode="outlined"
                multiline
                numberOfLines={4}
                style={[styles.input, { backgroundColor: colors.backgroundSecondary }]}
                textColor={colors.text}
                placeholderTextColor={colors.textTertiary}
              />

              <View style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setModalVisible(false);
                    setVoiceTranscript("");
                    setIsRecording(false);
                  }}
                  style={[styles.actionButton, { borderColor: colors.cardBorder }]}
                  textColor={colors.text}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSubmitGrievance}
                  style={[styles.actionButton, { backgroundColor: colors.primary }]}
                  labelStyle={{ color: colors.card }}
                >
                  Submit
                </Button>
              </View>
            </ScrollView>
          </Modal>
        </Portal>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontWeight: '400',
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  quickActionContent: {
    padding: 16,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    textAlign: 'center',
    lineHeight: 16,
  },
  grievancesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  grievancesList: {
    gap: 12,
  },
  grievanceCard: {
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  grievanceCardContent: {
    padding: 20,
  },
  grievanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  grievanceTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  grievanceTitle: {
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 22,
  },
  grievanceBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  urgentBadge: {
    borderRadius: 4,
  },
  urgencyChip: {
    borderRadius: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  category: {
    fontWeight: '500',
    textTransform: 'uppercase',
    fontSize: 12,
  },
  description: {
    lineHeight: 20,
    marginBottom: 16,
  },
  grievanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  date: {
    fontWeight: '400',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusChip: {
    borderRadius: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  modal: {
    margin: 20,
    borderRadius: 16,
    maxHeight: '90%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  modalTitle: {
    fontWeight: '600',
  },
  input: {
    marginBottom: 16,
    borderRadius: 8,
  },
  menuContainer: {
    marginBottom: 16,
  },
  menuButton: {
    width: '100%',
    borderRadius: 8,
  },
  voiceContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  voiceButton: {
    minWidth: 200,
    borderRadius: 8,
  },
  recordingButton: {
    backgroundColor: '#f44336',
  },
  recordingText: {
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  transcriptContainer: {
    marginTop: 8,
    width: '100%',
  },
  liveTranscript: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  transcriptLabel: {
    marginBottom: 4,
    fontWeight: '500',
  },
  transcriptText: {
    fontStyle: 'italic',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
  },
  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  emptyContent: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
