import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function TabTwoScreen() {
  const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState("");

  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));
  useSpeechRecognitionEvent("result", (event) => {
    setTranscript(event.results[0]?.transcript);
  });
  useSpeechRecognitionEvent("error", (event) => {
    console.log("error code:", event.error, "error message:", event.message);
  });

  const handleStart = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      console.warn("Permissions not granted", result);
      return;
    } else if (result) {
      console.log("Status:", result.status);
      console.log("Granted:", result.granted);
      console.log("Can ask again:", result.canAskAgain);
      console.log("Expires:", result.expires);
    }

    // Start speech recognition
    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      continuous: false,
    });
  };

  return (
    <>
      <View style={styles.container}>
        {!recognizing ? (
          <Button title="Start" onPress={handleStart} />
        ) : (
          <Button
            title="Stop"
            onPress={() => ExpoSpeechRecognitionModule.stop()}
          />
        )}
        {/* <ScrollView> */}
        <Text>{transcript}</Text>
        {/* </ScrollView> */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 10,
  },
});
