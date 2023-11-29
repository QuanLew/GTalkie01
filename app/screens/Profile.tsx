import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../../firebaseConfig";
import { getAuth, updateProfile } from "firebase/auth";
import theme from "../../theme";
import TextInput from "../components/TextInput";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const Profile = ({ navigation }: any) => {
  const [isLoading, setLoading] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

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
    } else {
      imgURI = user.photoURL;
      setLoading(false);
    }

    setLoading(true);

    const blob: any = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", imgURI, true);
      xhr.send(null);
    });

    const ref = storage.ref(storage.getStorage(), "images/" + user.uid);

    await storage.uploadBytes(ref, blob);

    const url = await storage.getDownloadURL(ref);

    await updateProfile(user, { photoURL: url })
      .then((res) => {
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  };

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          style={{
            alignItems: "center",
            width: "45%",
            height: "45%",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 20,
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
            {user.photoURL ? (
              <Image
                source={{ uri: user.photoURL, cache: "force-cache" }}
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
                  {user.photoURL ? "Edit" : "Upload"} Image
                </Text>
                <AntDesign name="camera" size={20} color="black" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
      {/* <Text>User ID {user.uid}</Text> */}
      <View style={styles.inputContainer}>
        <TextInput
          value={user.email}
          onChangeText={() => setLoading(false)}
          placeholder={user.email}
          before={
            <MaterialCommunityIcons
              name="email-outline"
              size={24}
              color={theme.colors.primary}
            />
          }
          secureTextEntry={true}
          editable={false}

        />
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.buttonText}>Reset password</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    marginTop: -50,
    alignItems: "center",
  },
  signIn: {
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#DF7E7E",
    borderRadius: 8,
    padding: 20,
    width: "90%",
    marginTop: "auto",
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});
export default Profile;
