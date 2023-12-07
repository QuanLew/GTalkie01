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
import React, { useState, useEffect, useCallback } from "react";
import { Audio } from "expo-av";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import theme from "../../theme";

const Main = ({ navigation }: any) => {
  const colours = [
    "red",
    "orange",
    "yellow",
    "blue",
    "green",
    "indigo",
    "violet",
  ];
  const getColour = () => colours[Math.floor(Math.random() * colours.length)];
  const [borderColor, setBorderColor] = useState(getColour());
  const [plainemail, setPlainEmail] = useState("");
  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {downloadAsset()}, []);

  const downloadAsset = async () => {
    const directory = `${FileSystem.cacheDirectory}ExponentAsset-b62641afc9ab487008e996a5c5865e56.ttf`;

    // Check if the directory exists, create it if not
    const directoryInfo = await FileSystem.getInfoAsync(directory);
    if (!directoryInfo.exists) {
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    }

    // Now, you can safely call downloadAsync
    const downloadResult = await FileSystem.downloadAsync(
      "https://example.com/path-to-your-asset.ttf",
      directory
    );

    console.log("Download result:", downloadResult);
  };

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
          bitsPerSecond: 0,
        },
      });
      await recording.startAsync();
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    // console.log("submit 1" + transcription);
    // handleSubmit("http://127.0.0.1:4000/api/transcribe", "uri");
    // console.log("submit 2: " + transcription);
    //handleAskAI("http://localhost:4000/api/ask", transcription);
    //console.log("submit 3");

    try {
      setRecording(undefined);
      setTranscription("");
      setPlainEmail("");
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
        console.log("Recording directory doesn't exist, creating…");
      } else {
        console.log("Created");
      }

      //console.log("Link type of URI: " + typeof uri);
      handleSubmit("http://localhost:4000/api/transcribe", uri);
      handleAskAI(
        "http://localhost:4000/api/ask",
        "How to change Fahrenheit to Celsius?"
      );
      console.log("Recording stopped and stored at", uri);

      setRecordings(allRecordings);
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  }

  useEffect(() => {
    console.log("submit effect: " + transcription);
    setTranscription(transcription);
    //handleAskAI("http://localhost:4000/api/ask", transcription);
  }, [transcription]);

  // const getTranscription = useCallback(
  //   (prevTranscription) => {
  //     !prevTranscription === prevTranscription;
  //   },
  //   [transcription]
  // );

  // handle user's voice
  const handleSubmit = async (url: string, userData: string) => {
    // try {
    //   setLoading(true);
    //   await axios.post(url, userData).then((res) => {
    //     console.log("submit reppp here: " + res.data.transcription);
    //     setTranscription(res.data.transcription);
    //     setLoading(false);
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
    setLoading(true);
    await axios
      .post(url, userData)
      .then(function (response) {
        console.log("submit reppp here: " + response.data.transcription);
        setTranscription(response.data.transcription);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        console.log("submit transcript the end: " + transcription);
        handleAskAI("http://localhost:4000/api/ask", transcription);
      });
  };

  // handle users' voice to plain email
  const handleAskAI = useCallback(
    async (url: string, userData: string) => {
      // try {
      //   //setLoading(true);
      //   const checkmsg = userData.toLowerCase();
      //   console.log("submit msg: " + checkmsg);
      //   const keywords = ["email", "letter", "send", "write", "weather"]; // add more keywords
      //   if (!keywords.some((keyword) => checkmsg.includes(keyword))) {
      //     console.log("submit reppppp dont have kw");
      //     setTranscription(
      //       "I'm your email bot, ask me anything related to email"
      //     );
      //     //setLoading(false);
      //     return;
      //   }

      //   const response = await axios.post(url, userData).then((res) => {
      //     setPlainEmail(res.data.message);
      //     //setLoading(false);
      //   });

      //   //console.log("AI reply back: " + response.data.message);
      // } catch (error) {
      //   console.log(error);
      // }

      //setLoading(true);
      const checkmsg = userData.toLowerCase();
      console.log("submit msg: " + checkmsg);
      const keywords = ["email", "letter", "send", "write", "weather"]; // add more keywords
      if (!keywords.some((keyword) => checkmsg.includes(keyword))) {
        console.log("submit reppppp dont have kw");
        setTranscription(
          "I'm your email bot, ask me anything related to email"
        );
        //setLoading(false);
        return;
      } else {
        await axios
          .post(url, userData)
          .then(function (response) {
            setPlainEmail(response.data.message);
            //setLoading(false);
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(function () {
            console.log("submit end handle plain email");
          });
      }
    },
    [transcription]
  );

  // function askAI() {
  //   return useCallback(
  //     async (url: string, userData: string) => {
  //       const checkmsg = userData.toLowerCase();
  //       console.log("submit msg: " + checkmsg);
  //       const keywords = ["email", "letter", "send", "write", "weather"]; // add more keywords
  //       if (!keywords.some((keyword) => checkmsg.includes(keyword))) {
  //         console.log("submit reppppp dont have kw");
  //         setTranscription(
  //           "I'm your email bot, ask me anything related to email"
  //         );
  //         //setLoading(false);
  //         return;
  //       }

  //       await axios
  //         .post(url, userData)
  //         .then(function (response) {
  //           setPlainEmail(response.data.message);
  //           //setLoading(false);
  //         })
  //         .catch(function (error) {
  //           console.log(error);
  //         })
  //         .finally(function () {
  //           console.log("submit end handle plain email");
  //         });
  //     },
  //     [transcription]
  //   );
  // }

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

  function LoadingAnimation() {
    return (
      <View style={styles.indicatorWrapper}>
        <ActivityIndicator size="large" />
        <Text style={styles.title}>Loading your voice...</Text>
      </View>
    );
  }

  const onPress = () => {
    setRecording(recording ? stopRecording : startRecording);
    setBorderColor(getColour());
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>How can I help you?</Text>
        <Text style={styles.instructions}>
          Press and hold this button to record your voice. Release the button to
          send the recording, and you'll hear a response
        </Text>

        <TouchableOpacity
          style={{
            width: "90%",
            padding: 30,
            gap: 10,
            borderWidth: 3,
            alignItems: "center",
            borderRadius: 10,
            borderColor: borderColor,
          }}
          onPress={onPress}
        >
          <Image source={require("../../assets/images/robot.gif")} />
          <Text style={styles.title}>
            {" "}
            {recording ? "Stop Recording\n\n\n" : "Start Recording\n\n\n"}{" "}
          </Text>
        </TouchableOpacity>
        {loading ? (
          <LoadingAnimation />
        ) : (
          <Text style={styles.title}>Your message: "{transcription}"</Text>
        )}
        <Text style={styles.title}>Your result: "{plainemail}"</Text>
      </ScrollView>
      <TouchableOpacity
        style={styles.keyboard}
        onPress={() =>
          navigation.navigate("SendEmail", {
            subject: "",
            body: "",
          })
        }
      >
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
    paddingBottom: 20,
  },
  title: {
    color: theme.colors.textPrimary,
    textAlign: "center",
    fontFamily: "Fredoka",
    fontSize: 20,
    padding: 10,
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
  },
  indicatorWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
