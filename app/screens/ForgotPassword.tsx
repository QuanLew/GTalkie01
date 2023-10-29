import React, { useState } from "react";
import {
  Text,
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import GoBack from "../components/GoBack";
import { MaterialIcons } from "@expo/vector-icons";
import TextInput from "../components/TextInput";
import theme from "../../theme";
const ForgotPassword = ({ navigation }: any) => {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email).then(() => {
        Alert.alert(
          "Thank you",
          "You will receive an email with information for creating a new password",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
        navigation.navigate("Login");
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Reset Password</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email address"
          before={
            <MaterialIcons
              name="lock-outline"
              size={24}
              color={theme.colors.primary}
            />
          }
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleResetPassword}
        disabled={!email}
      >
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ForgotPassword;
const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems:"center",
    backgroundColor: theme.colors.background,
    justifyContent:"center"
  },
  title: {
    fontSize: 20,
    color: theme.colors.textPrimary,
    textAlign: "center",
    fontFamily: "Fredoka",
    marginTop: 10,
  },
  icon: {
    resizeMode: "contain",
    width: "50%",
    height: "35%",
    marginTop: 70,
    marginLeft: "25%",
  },
  inputContainer: {
    rowGap: 20,
    marginTop: 20,
    paddingBottom:20
  },
  signIn: {
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#DF7E7E",
    borderRadius: 8,
    padding: 20,
    width: "90%",
    paddingTop: "auto"
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});
