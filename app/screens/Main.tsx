import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useVoiceRecognition } from "../hooks/useVoiceRecognition";

const Main = ({ navigation }: any) => {
  const [borderColor, setBorderColor] = useState<"lightgray" | "lightgreen">(
    "lightgray"
  );
  const { state, startRecognizing, stopRecognizing, destroyRecognizer } =
    useVoiceRecognition();

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>How can I help you?</Text>
      <Text style={styles.instructions}>
        Press and hold this button to record your voice. Release the button to
        send the recording, and you'll hear a response
      </Text>
      <Pressable
        onPressIn={() => {
          setBorderColor("lightgreen");
          startRecognizing();
        }}
        onPressOut={() => {
          setBorderColor("lightgray");
          stopRecognizing();
          //handleSubmit();
        }}
        style={{
          width: "90%",
          padding: 30,
          gap: 10,
          borderWidth: 3,
          alignItems: "center",
          borderRadius: 10,
          borderColor: borderColor,
        }}
      >
        <Image source={require("../../assets/images/robot.gif")} />
        <Text style={styles.welcome}>
          {state.isRecording ? "Release to Send" : "Hold to Speak"}
        </Text>
      </Pressable>
      <Text style={styles.welcome}>Your message: "{state.results[0]}"</Text>
      <TouchableOpacity>
        <MaterialIcons name="record-voice-over" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SendEmail")}>
        <FontAwesome5 name="keyboard" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    padding: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
    fontSize: 12,
  },
});
