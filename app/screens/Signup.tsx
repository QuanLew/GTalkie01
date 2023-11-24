import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState } from "react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import CheckBox from "expo-checkbox";
import { StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { getAuth, updateProfile } from "firebase/auth";
import { auth, storage } from "../../firebaseConfig";
import theme from "../../theme";
import TextInput from "../components/TextInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
const Signup = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reenter_password, setReEnterPassword] = useState("");
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let imgURI = null;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      imgURI = result.assets[0].uri;
      setImage(imgURI);
    }
  };

  const uploadImage = async (uri) => {
    const auth = getAuth();
    const user = auth.currentUser;

    const blob: any = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const ref = storage.ref(storage.getStorage(), "images/" + user.uid);

    storage.uploadBytes(ref, blob);

    storage.getDownloadURL(ref).then((url) => {
      updateProfile(user, { photoURL: url });
    });
  };

  const handleSubmit = async () => {
    if (email && password && password == reenter_password && toggleCheckBox) {
      try {
        await createUserWithEmailAndPassword(auth, email, password).then(
          (res) => {
            uploadImage(image);
            signOut(auth);
          }
        );
        Alert.alert(
          "Congratulations",
          "Your account has been successfully created. Please login to continue.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      } catch (e) {
        alert(e);
      }
    } else if (
      email &&
      password &&
      password == reenter_password &&
      !toggleCheckBox
    ) {
      Alert.alert("Oops!", "Please agree to the Terms and Conditions", [
        {text: 'OK', onPress: () => console.log('Check missing')},
      ]);
    } else if (password != reenter_password) {
      Alert.alert("Oops!", "Please make sure your passwords match", [
        {text: 'OK', onPress: () => console.log('Password doesnt match')},
      ]);
    } else {
      Alert.alert("Oops!", "Please enter email and password", [
        {text: 'OK', onPress: () => console.log('Missing field')},
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View>
          <View style={{width:"15%"}}>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.paragraph}>Back</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.title, { marginTop: 20, paddingBottom:10 }]}>
            Let's Get Started
          </Text>
        </View>
        <TouchableOpacity
          style={{
            alignItems: "center",
            width: "40%",
            height: "23%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          onPress={pickImage}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 100,
              backgroundColor: "lightgray",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {image ? (
              <Image
                source={{ uri: image, cache: "force-cache" }}
                style={{
                  resizeMode: "cover",
                  width: "100%",
                  height: "100%",
                  borderRadius: 100,
                }}
              />
            ) : (
              <View style={{ alignItems: "center" }}>
                <Text style={[styles.paragraph]}>
                  {image ? "Edit" : "Upload"} Image
                </Text>
                <AntDesign name="camera" size={20} color="black" />
              </View>
            )}
          </View>
        </TouchableOpacity>
        <View style={{alignItems:"center"}}>
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
            <TextInput
              value={reenter_password}
              onChangeText={(value) => setReEnterPassword(value)}
              placeholder="Confirm Password"
              before={
                <MaterialIcons
                  name="lock-outline"
                  size={24}
                  color={theme.colors.primary}
                />
              }
              secureTextEntry={true}
            />
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <CheckBox
                style={styles.checkbox}
                value={toggleCheckBox}
                color={toggleCheckBox ? "#4630EB" : undefined}
                onValueChange={(newValue) => setToggleCheckBox(newValue)}
              />
              <Text style={styles.paragraph}>
                By clicking here, I state that I have read and understood the
                terms and conditions
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={styles.paragraph}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.paragraph}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    margin: 8,
  },
  container: {
    height: "100%",
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
    width: "50%",
    height: "35%",
    marginTop: 70,
    marginLeft: "25%",
  },
  inputContainer: {
    rowGap: 20,
    marginTop: 20,
  },
  signIn: {
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#DF7E7E",
    borderRadius: 8,
    padding: 20,
    width: "90%",
    marginLeft: "5%",
    marginTop:"auto"
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Signup;
