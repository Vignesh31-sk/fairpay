import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { DUMMY_GRIEVANCES } from "@/constants/Data";
import { Grievance } from "@/types";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import React, { useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import {
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

export default function GrievanceScreen() {
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
    { label: "Payment Issue", value: "payment_issue" },
    { label: "Job Mismatch", value: "job_mismatch" },
    { label: "Workplace Safety", value: "workplace_safety" },
    { label: "Harassment", value: "harassment" },
    { label: "Other", value: "other" },
  ];

  const urgencyLevels = [
    { label: "Normal", value: "normal" },
    { label: "Urgent", value: "urgent" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#ff9800";
      case "in_progress":
        return "#2196f3";
      case "resolved":
        return "#4caf50";
      case "closed":
        return "#757575";
      default:
        return "#757575";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    return urgency === "urgent" ? "#f44336" : "#666";
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

  const renderGrievance = ({ item }: { item: Grievance }) => (
    <Card style={styles.grievanceCard}>
      <Card.Content>
        <View style={styles.grievanceHeader}>
          <Text variant="titleMedium" style={styles.grievanceTitle}>
            {item.title}
          </Text>
          <View style={styles.badges}>
            <Chip
              mode="outlined"
              compact
              textStyle={{ color: getUrgencyColor(item.urgency) }}
            >
              {item.urgency.toUpperCase()}
            </Chip>
          </View>
        </View>

        <Text variant="bodySmall" style={styles.category}>
          {categories.find((cat) => cat.value === item.category)?.label}
        </Text>

        <Text variant="bodyMedium" style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.grievanceFooter}>
          <Text variant="bodySmall" style={styles.date}>
            {formatDate(item.timestamp)}
          </Text>
          <Chip
            mode="flat"
            compact
            style={{ backgroundColor: getStatusColor(item.status) + "20" }}
            textStyle={{ color: getStatusColor(item.status) }}
          >
            {item.status.replace("_", " ").toUpperCase()}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        Grievances
      </ThemedText>

      <FlatList
        data={grievances}
        renderItem={renderGrievance}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grievancesList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              No grievances filed yet
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              Use the + button to file your first grievance
            </Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
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
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            File a Grievance
          </Text>

          <TextInput
            label="Title *"
            value={newGrievance.title}
            onChangeText={(text) =>
              setNewGrievance((prev) => ({ ...prev, title: text }))
            }
            mode="outlined"
            style={styles.input}
          />

          <View style={styles.menuContainer}>
            <Menu
              visible={categoryMenuVisible}
              onDismiss={() => setCategoryMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setCategoryMenuVisible(true)}
                  style={styles.menuButton}
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
                  style={styles.menuButton}
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
              ]}
              buttonColor={isRecording ? "#f44336" : undefined}
            >
              {isRecording
                ? "🔴 Recording... Tap to Stop"
                : "🎤 Record Voice Note"}
            </Button>
            {isRecording && (
              <View style={styles.transcriptContainer}>
                <Text variant="bodySmall" style={styles.recordingText}>
                  Speak clearly. Tap the button above to stop recording.
                </Text>
                {voiceTranscript ? (
                  <View style={styles.liveTranscript}>
                    <Text variant="bodySmall" style={styles.transcriptLabel}>
                      Live transcript:
                    </Text>
                    <Text variant="bodyMedium" style={styles.transcriptText}>
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
            style={styles.input}
          />

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => {
                setModalVisible(false);
                setVoiceTranscript("");
                setIsRecording(false);
              }}
              style={styles.actionButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmitGrievance}
              style={styles.actionButton}
            >
              Submit
            </Button>
          </View>
        </Modal>
      </Portal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  grievancesList: {
    paddingBottom: 100,
  },
  grievanceCard: {
    marginBottom: 12,
  },
  grievanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  grievanceTitle: {
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  badges: {
    flexDirection: "row",
    gap: 4,
  },
  category: {
    color: "#6200ea",
    marginBottom: 8,
    textTransform: "uppercase",
    fontSize: 12,
  },
  description: {
    color: "#555",
    lineHeight: 20,
    marginBottom: 12,
  },
  grievanceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    color: "#666",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: "90%",
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 16,
  },
  menuContainer: {
    marginBottom: 16,
  },
  menuButton: {
    width: "100%",
  },
  voiceContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  voiceButton: {
    minWidth: 200,
  },
  recordingButton: {
    backgroundColor: "#f44336",
  },
  recordingText: {
    marginTop: 8,
    textAlign: "center",
    color: "#f44336",
    fontStyle: "italic",
  },
  transcriptContainer: {
    marginTop: 8,
    width: "100%",
  },
  liveTranscript: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#6200ea",
  },
  transcriptLabel: {
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },
  transcriptText: {
    color: "#333",
    fontStyle: "italic",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "500",
  },
  emptySubtext: {
    textAlign: "center",
    color: "#666",
  },
});
