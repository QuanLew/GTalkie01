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
import theme from "../../theme";

const Main = ({ navigation }: any) => {
  const [borderColor, setBorderColor] = useState<"lightgray" | "lightgreen">(
    "lightgray"
  );
  const { state, startRecognizing, stopRecognizing, destroyRecognizer } =
    useVoiceRecognition();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How can I help you?</Text>
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
        <Text style={styles.title}>
          {state.isRecording ? "Release to Send" : "Hold to Speak"}
        </Text>
      </Pressable>
      <Text style={styles.title}>Your message: "{state.results[0]}"</Text>
      <TouchableOpacity style={{top:90, right:120}}>
        <MaterialIcons name="record-voice-over" size={30} color="#D6665C" />
      </TouchableOpacity>

      <TouchableOpacity style={{top:60, left:120}} onPress={() => navigation.navigate("SendEmail")}>
        <FontAwesome5 name="keyboard" size={30} color="#D6665C" />
      </TouchableOpacity>
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  instructions: {
    color: theme.colors.textPrimary,
    textAlign: "center",
    fontFamily: "Fredoka",
    fontSize: 16,
    paddingTop: 20,
    paddingBottom: 20
  },
  title: { 
    color: theme.colors.textPrimary,
    textAlign: "center",
    fontFamily: "Fredoka",
    fontSize: 20,
    padding:10

  },
});
