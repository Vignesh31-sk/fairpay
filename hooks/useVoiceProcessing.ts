import { VoiceIntent, voiceIntentService } from "@/services/voiceIntentService";
import { router } from "expo-router";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export const useVoiceProcessing = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNavigation = useCallback((intent: VoiceIntent) => {
    switch (intent.action) {
      case "navigate_profile":
        router.push("/(tabs)/profile" as any);
        break;
      case "navigate_jobs":
        router.push("/(tabs)/jobs" as any);
        break;
      case "navigate_analytics":
        router.push("/(tabs)/analytics" as any);
        break;
      case "navigate_grievance":
        router.push("/(tabs)/grievance" as any);
        break;
      default:
        Alert.alert("Navigation Error", "Unknown destination");
    }
  }, []);

  const handleJobSearch = useCallback((intent: VoiceIntent) => {
    const jobType = intent.parameters?.jobType || "";

    if (jobType) {
      router.push({
        pathname: "/(tabs)/jobs" as any,
        params: { search: jobType },
      } as any);

      Alert.alert("Job Search", `Searching for ${jobType} jobs...`, [
        { text: "OK" },
      ]);
    } else {
      router.push("/(tabs)/jobs" as any);
      Alert.alert("Job Search", "Opening jobs page...", [{ text: "OK" }]);
    }
  }, []);

  const handleJobAction = useCallback((intent: VoiceIntent) => {
    switch (intent.action) {
      case "apply_job":
        Alert.alert("Job Application", "Application submitted successfully!", [
          { text: "OK" },
        ]);
        break;
      case "save_job":
        Alert.alert("Job Saved", "Job has been saved to your favorites!", [
          { text: "OK" },
        ]);
        break;
      case "view_job_details":
        router.push("/(tabs)/jobs" as any);
        Alert.alert("Job Details", "Opening job details...", [{ text: "OK" }]);
        break;
      default:
        Alert.alert("Job Action Error", "Unknown job action");
    }
  }, []);

  const handleGrievance = useCallback((intent: VoiceIntent) => {
    switch (intent.action) {
      case "file_grievance":
        router.push("/(tabs)/grievance" as any);
        Alert.alert("File Grievance", "Opening grievance form...", [
          { text: "OK" },
        ]);
        break;
      case "view_grievances":
        router.push("/(tabs)/grievance" as any);
        Alert.alert("View Grievances", "Opening your grievances...", [
          { text: "OK" },
        ]);
        break;
      default:
        router.push("/(tabs)/grievance" as any);
    }
  }, []);

  const executeAction = useCallback(
    async (intent: VoiceIntent, originalText: string) => {
      switch (intent.intent) {
        case "navigation":
          handleNavigation(intent);
          break;

        case "job_search":
          handleJobSearch(intent);
          break;

        case "job_action":
          handleJobAction(intent);
          break;

        case "grievance":
          handleGrievance(intent);
          break;

        default:
          // Fallback for unknown intents
          Alert.alert(
            "Command not recognized",
            `I didn't understand: "${originalText}". Try saying something like "Show me jobs" or "Go to profile".`,
            [{ text: "OK" }]
          );
      }
    },
    [handleNavigation, handleJobSearch, handleJobAction, handleGrievance]
  );

  const processVoiceCommand = useCallback(
    async (text: string) => {
      setIsProcessing(true);

      try {
        console.log(`Processing voice command: "${text}"`);

        // Use AI to analyze intent
        const intent: VoiceIntent = await voiceIntentService.analyzeIntent(
          text
        );
        console.log("Detected intent:", intent);

        // Execute action based on intent
        await executeAction(intent, text);
      } catch (error) {
        console.error("Voice command processing error:", error);
        Alert.alert(
          "Error",
          "Failed to process voice command. Please try again."
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [executeAction]
  );

  const startListening = useCallback(async () => {
    try {
      const { granted } =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!granted) {
        Alert.alert(
          "Permission required",
          "Please enable microphone permissions to use voice commands."
        );
        return;
      }

      setIsListening(true);
      setTranscript("");

      await ExpoSpeechRecognitionModule.start({
        lang: "en-US",
        interimResults: true,
        maxAlternatives: 1,
        continuous: false,
        requiresOnDeviceRecognition: false,
      });
    } catch (error) {
      console.error("Failed to start voice recognition:", error);
      Alert.alert(
        "Error",
        "Failed to start voice recognition. Please try again."
      );
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(async () => {
    try {
      await ExpoSpeechRecognitionModule.stop();
      setIsListening(false);
    } catch (error) {
      console.error("Failed to stop voice recognition:", error);
      setIsListening(false);
    }
  }, []);

  // Event listeners
  useSpeechRecognitionEvent("start", () => {
    setIsListening(true);
  });

  useSpeechRecognitionEvent("result", (event) => {
    const recognizedText = event.results[0]?.transcript || "";
    setTranscript(recognizedText);

    if (event.isFinal) {
      processVoiceCommand(recognizedText);
      setIsListening(false);
      console.log(`Recognized command: ${recognizedText}`);
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    console.error("Speech recognition error:", event.error);
    Alert.alert("Voice Recognition Error", "Please try again.");
    setIsListening(false);
  });

  useSpeechRecognitionEvent("end", () => {
    setIsListening(false);
  });

  return {
    isListening,
    transcript,
    isProcessing,
    startListening,
    stopListening,
    processVoiceCommand,
  };
};
