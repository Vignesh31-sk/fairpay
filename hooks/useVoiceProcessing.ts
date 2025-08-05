import { VOICE_COMMANDS } from "@/constants/Data";
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

  const extractJobType = useCallback((command: string): string => {
    if (command.includes("electrician")) return "electrician";
    if (command.includes("plumber") || command.includes("plumbing"))
      return "plumber";
    if (command.includes("construction")) return "construction";
    if (command.includes("mechanic")) return "mechanic";
    if (command.includes("welder")) return "welder";
    if (command.includes("carpenter")) return "carpenter";
    return "";
  }, []);

  const processVoiceCommand = useCallback(
    (text: string) => {
      const lowerText = text.toLowerCase().trim();
      setIsProcessing(true);

      try {
        // Check navigation commands
        for (const [command, action] of Object.entries(
          VOICE_COMMANDS.NAVIGATION
        )) {
          if (lowerText.includes(command)) {
            switch (action) {
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
            }
            setIsProcessing(false);
            return;
          }
        }

        // Check job search commands
        for (const [command] of Object.entries(VOICE_COMMANDS.JOB_SEARCH)) {
          if (lowerText.includes(command)) {
            const jobType = extractJobType(command);
            router.push({
              pathname: "/(tabs)/jobs" as any,
              params: { search: jobType },
            } as any);
            setIsProcessing(false);
            return;
          }
        }

        // Check job action commands
        for (const [command, action] of Object.entries(
          VOICE_COMMANDS.JOB_ACTIONS
        )) {
          if (lowerText.includes(command)) {
            if (action === "apply_job") {
              Alert.alert(
                "Job Application",
                "Application submitted successfully!",
                [{ text: "OK" }]
              );
            } else if (action === "apply_specific_job") {
              const jobType = extractJobType(lowerText);
              Alert.alert(
                "Job Application",
                `Applied for ${jobType} job successfully!`,
                [{ text: "OK" }]
              );
            }
            setIsProcessing(false);
            return;
          }
        }

        // Fallback for unrecognized commands
        Alert.alert(
          "Command not recognized",
          `I didn't understand: "${text}". Try saying something like "Show me jobs" or "Go to profile".`,
          [{ text: "OK" }]
        );
      } catch (error) {
        console.error("Voice command processing error:", error);
        Alert.alert("Error", "Failed to process voice command.");
      } finally {
        setIsProcessing(false);
      }
    },
    [extractJobType]
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
