import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import Dialog from "react-native-dialog";
import theme from "../../theme";
import TextInput from "../components/TextInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const showDialog = () => {
    setVisible(true);
  };

  const handleSubmit = async () => {
    console.log(email);
    if (email && password) {
      setLoading(true);
      const user = await signInWithEmailAndPassword(
        auth,
        email,
        password
      ).catch((error) => {
        // Handle Errors here.
        var errorMessage = error.message;
        if (errorMessage == "Firebase: Error (auth/invalid-email).") {
          Alert.alert("Oops", "Invalid email or password. Please try again", [
            { text: "OK", onPress: () => console.log('Try again') },
          ]);
        } else {
          Alert.alert("Oops", errorMessage, [
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);
        }
      });
    } else {
      // show error
      showDialog();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
       <Image
          source={require("../../assets/icons/ios/new_icon.png")}
          style={styles.icon}
        />
      <View style={{marginTop:-50}}>
        <Text style={styles.title}>Welcome to G-Talkie</Text>
        <Text style={styles.paragraph}>Make our life become easier</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={email}
          onChangeText={(value) => setEmail(value)}
          placeholder="Email"
          before={
            <MaterialCommunityIcons
              name="email-outline"
              size={24}
              color={theme.colors.primary}
            />
          }
          secureTextEntry={false}
        />
        <TextInput
          value={password}
          onChangeText={(value) => setPassword(value)}
          placeholder="Password"
          before={
            <MaterialIcons
              name="lock-outline"
              size={24}
              color={theme.colors.primary}
            />
          }
          secureTextEntry={true}
        />

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text
            style={{
              left: "55%",
              fontSize: 12,
              color: theme.colors.textPrimary,
              fontWeight: "bold",
            }}
          >
            Forgot password?
          </Text>
        </TouchableOpacity>
        <View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>LOGIN</Text>
            <Dialog.Container
              visible={visible}
              onBackdropPress={() => setVisible(false)}
            >
              <Dialog.Title>Error</Dialog.Title>
              <Dialog.Description>
                Email address and password is required.
              </Dialog.Description>
            </Dialog.Container>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={[styles.paragraph]}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.paragraph}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems:"center",
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
  signIn: {
    textDecorationLine: "underline",
  },
  button: {
    marginTop: "auto",
    backgroundColor: "#DF7E7E",
    borderRadius: 8,
    padding: 20,
    width: "90%",
    marginLeft: "5%",
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});
export default Login;