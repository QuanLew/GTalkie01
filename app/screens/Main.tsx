import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Audio } from "expo-av";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import theme from "../../theme";

const Main = ({ navigation }: any) => {
  const colours = ['red', 'orange', 'yellow', 'blue', 'green', 'indigo', 'violet'];
  const getColour = () => colours[Math.floor(Math.random() * colours.length)];
  const [borderColor, setBorderColor] = useState(getColour());
  const [plainemail, setPlainEmail] = useState("");
  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  
  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      const { status } = await Audio.requestPermissionsAsync();

      if (status !== "granted") {
        console.error("Permission to access audio is denied");
        return;
      }

      // needed for IOS
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
      });

      console.log("Starting recording..");
      const recording = new Audio.Recording();
      const { ios, android } = Audio.RecordingOptionsPresets.HIGH_QUALITY;
      await recording.prepareToRecordAsync({
        android: android,
        ios: {
          ...ios,
          extension: ".mp4",
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
        },
        web: {
          mimeType: "",
          bitsPerSecond: 0
        }
      });

      await recording.startAsync();
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    try {
      setRecording(undefined);
      await recording.stopAndUnloadAsync();

      let allRecordings = [...recordings];
      const { sound, status } = await recording.createNewLoadedSoundAsync();
      allRecordings.push({
        sound: sound,
        duration: getDurationFormatted(status.durationMillis),
        file: recording.getURI(),
      });

      const uri = recording.getURI();
      const temp = await FileSystem.getInfoAsync(uri);

      if (!temp.exists) {
        console.log("Gif directory doesn't exist, creating…");
      } else {
        console.log("Created");
      }
      //console.log("Link type of URI: " + typeof uri);
      handleSubmit("http://localhost:4000/api/transcribe", uri);
      handleAskAI("http://localhost:4000/api/ask", "How to change Fahrenheit to Celsius?");
      console.log("Recording stopped and stored at", uri);

      setRecordings(allRecordings);
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  }

  useEffect(() => {
    setTranscription(transcription)
    console.log("useEffect: " + transcription);
  }, [transcription]);

  const handleSubmit = async (url: string, userData: string) => {
    try {
      const response = await axios.post(url, userData);
      setTranscription(response.data.transcription)
      console.log("res: " + transcription);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAskAI = async (url: string, userData: string) => {
    try {
      setLoading(true)
      const response = await axios
      .post(url, userData)
      .then((res) => {
        console.log("reppp here: "+res.data.message);
        setPlainEmail(res.data.message);
        setLoading(false)
      })
      
      //console.log("AI reply back: " + response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  function getDurationFormatted(milliseconds: number) {
    const minutes = milliseconds / 1000 / 60;
    const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
    return seconds < 10
      ? `${Math.floor(minutes)}:0${seconds}`
      : `${Math.floor(minutes)}:${seconds}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            Recording #{index + 1} | {recordingLine.duration}
          </Text>
          <Button
            onPress={() => recordingLine.sound.replayAsync()}
            title="Play"
          ></Button>
        </View>
      );
    });
  }

  function clearRecordings() {
    setRecordings([]);
  }

  const onPress = () => {
    setRecording(recording ? stopRecording : startRecording)
    setBorderColor(getColour())
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
      <Text style={styles.title}>How can I help you?</Text>
      <Text style={styles.instructions}>
        Press and hold this button to record your voice. Release the button to
        send the recording, and you'll hear a response
      </Text>
 
      <TouchableOpacity style={{
        width: "90%",
        padding: 30,
        gap: 10,
        borderWidth: 3,
        alignItems: "center",
        borderRadius: 10,
        borderColor: borderColor,
      }}
        onPress={onPress}>
        <Image
        source={require("../../assets/images/robot.gif")}
        />
        <Text style={styles.title}> {recording ? "Stop Recording\n\n\n" : "Start Recording\n\n\n"} </Text>
      </TouchableOpacity>
      <Text style={styles.title}>Your message: "{transcription}"</Text>
      { loading ?
      <ActivityIndicator size="large"/> :
      <Text style={styles.title}>Your result: "{plainemail}"</Text>
      }
      {/* <TouchableOpacity style={{top:90, right:120}}>
        <MaterialIcons name="record-voice-over" size={30} color="#D6665C" />
      </TouchableOpacity> */}
      
      </ScrollView>
      <TouchableOpacity style={styles.keyboard} onPress={() => navigation.navigate("SendEmail")}>
        <FontAwesome5 name="keyboard" size={30} color="#D6665C" />
      </TouchableOpacity>
    </SafeAreaView>
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
  scrollView: {
    marginHorizontal: 15,
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 40,
  },
  fill: {
    flex: 1,
    margin: 15,
  },
  keyboard: {
    position: "absolute",
    bottom: 12,
    // top:60, 
    // left:120,


  }
});
