import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import theme from "../../theme";

const Main = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/robot.gif")} />
      <View>
        <Text style={styles.title}>How can I help you?</Text>
      </View>
      <TouchableOpacity style={{top: 350, right: 100}}>
        <MaterialIcons name="record-voice-over" size={50} color="#D6665C" />
      </TouchableOpacity>

      <TouchableOpacity style={{top:300, left: 100}} onPress={() => navigation.navigate("SendEmail")}>
        <FontAwesome5 name="keyboard" size={50} color='#D6665C' />
      </TouchableOpacity>
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 20,
    color: theme.colors.textPrimary,
    textAlign: "center",
    fontFamily: "Fredoka",
    marginTop: 10,
  },
  paragraph: {
    color: theme.colors.textPrimary,
    marginTop: 10,
    textAlign: "center",
    fontFamily: "Fredoka",
  },
  icon: {
    resizeMode: "contain",
    width: "35%",
    height: "35%",
  },
  inputContainer: {
    rowGap: 20,
    marginTop: 50,
  },

});
