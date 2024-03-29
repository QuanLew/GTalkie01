import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { auth, database } from "../../firebaseConfig";
import Dialog from "react-native-dialog";
import { AntDesign } from "@expo/vector-icons";
import getUID from "../components/getUID";
import { doc, setDoc } from "firebase/firestore";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import theme from "../../theme";

const SendEmail = ({ route, navigation }: any) => {
  const { infoEmail } = route.params;
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState(infoEmail.headerEmail[0]);
  const [content, setContent] = useState(infoEmail.bodyEmail.join(" "));
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPassData, setPassData] = useState(false);
  const uid = getUID();

  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [isDraft, setIsDraft] = useState(true); // if sent, then false
  const [isDeleted, setIsDeleted] = useState(false); // if delete, then true
  const [isStarred, setIsStarred] = useState(false); // if starred, then true

  console.log("Pass object email: " + infoEmail.headerEmail);
  console.log("Subject objecttttt: " + subject);
  console.log("Content objecttttt: " + content);

  useEffect(() => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    setCurrentDate(date + "/" + month + "/" + year);
    setCurrentTime(hours + ":" + min + ":" + sec);
  }, []);

  useEffect(() => {
    setSubject(infoEmail.headerEmail[0]);
    setContent(infoEmail.bodyEmail.join("\n"));
  }, [infoEmail]);

  const showDialog = () => {
    setVisible(true);
  };

  const handleEmail = (email) => {
    setRecipients(email);
  };

  const sender = auth.currentUser.email;

  // TODO: separate these twos into components
  const handleSubmit = async (e) => {
    if (!recipients || !subject || !content) {
      Alert.alert("Oops", "Recipients, subject or message is missing.", [
        { text: "OK", onPress: () => console.log("Incompleted form") },
      ]);
    }
    try {
      setLoading(true);
      setIsDraft(false);
      const data = await axios.post("http://localhost:4000/api/email", {
        sender,
        recipients,
        subject,
        content,
      });
      setLoading(false);
      setIsDraft(true);
      const draft = {
        id: uuidv4(),
        to: recipients,
        subject: subject,
        content: content,
        date: currentDate,
        time: currentTime,
        isDraft: false,
        isDeleted: false,
        isStarred: false,
      };
      await setDoc(doc(database, `users/${uid}/drafts/${draft.id}`), draft);
      Alert.alert("All set!", "Your email was sent", [
        { text: "OK", onPress: () => console.log("SENT") },
      ]);
      navigation.goBack();
    } catch (e) {
      console.log(e.response.data.message);
      setLoading(false);
    }
  };

  const saveDraft = async () => {
    if (recipients && subject && content) {
      const draft = {
        id: uuidv4(),
        to: recipients,
        subject: subject,
        content: content,
        date: currentDate,
        time: currentTime,
        isDraft,
        isDeleted,
        isStarred,
      };
      await setDoc(doc(database, `users/${uid}/drafts/${draft.id}`), draft)
        .then((docRef) => {
          Alert.alert("Nice work!", "Draft saved.", [
            { text: "OK", onPress: () => console.log("SAVED.") },
          ]);
          setRecipients("");
          setSubject("");
          setContent("");
        })
        .catch((error) => {
          Alert.alert("Oops", error, [
            { text: "OK", onPress: () => console.log("ERROR123: ", error) },
          ]);
        });
    } else {
      Alert.alert("Oops", "Email is incompleted.", [
        { text: "OK", onPress: () => console.log("Incompleted form") },
      ]);
    }
  };

  const textInputRef = useRef();
  const handleSubjectChange = (newText) => {
    if (textInputRef.current) {
      const { selection } = textInputRef.current;
      const newSubject =
        subject.slice(0, selection.start) +
        newText +
        subject.slice(selection.end);

      setSubject(newSubject);

      // Move the cursor to the end of the inserted text
      const newPosition = selection.start + newText.length;
      textInputRef.current.setNativeProps({
        selection: { start: newPosition, end: newPosition },
      });
    }
  };

  return (
    <View style={[styles.container]}>
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 20,
            padding: 5,
            borderBottomWidth: 0.5,
          }}
        >
          <Text style={styles.title}>To: </Text>
          <TextInput
            style={{ flex: 1, marginLeft: 5, marginTop: 5 }} // Adjust the marginLeft value as needed
            autoCapitalize="none"
            clearTextOnFocus
            value={recipients}
            placeholder="abc@gmail.com"
            onChangeText={(value) => setRecipients(value)}
            keyboardAppearance="default"
          />
          <AntDesign
            name="contacts"
            size={24}
            color="#D6665C"
            onPress={() => {
              navigation.navigate("ContactList", { callback: handleEmail });
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 20,
            padding: 5,
            borderBottomWidth: 0.5,
          }}
        >
          <Text style={styles.title}>Subject: </Text>
          <TextInput
            autoCapitalize="sentences"
            value={subject}
            placeholder="Subject"
            onChangeText={(value) => setSubject(value)}
            keyboardAppearance="default"
            multiline
          />
        </View>
        <View
          style={{
            marginHorizontal: 20,
            padding: 5,
            height: "70%",
            borderBottomWidth: 0.5,
          }}
        >
          <Text style={[styles.title]}>Message: </Text>
          <View style={{ flex: 1, paddingTop: 10 }}>
            <TextInput
              autoCapitalize="sentences"
              value={content}
              placeholder="Message"
              onChangeText={(value) => setContent(value)}
              keyboardAppearance="default"
              multiline
            />
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={saveDraft}>
          <Text style={styles.buttonText}>Save Draft</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SendEmail;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 20,
    color: theme.colors.textPrimary,
    fontFamily: "Fredoka",
  },
  paragraph: {
    color: theme.colors.textPrimary,
    textAlign: "center",
    fontFamily: "Fredoka",
  },
  contact: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  contactText: {
    flex: 1,
    paddingHorizontal: 4,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
  },
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 4,
  },
  button: {
    backgroundColor: "#DF7E7E",
    borderRadius: 8,
    padding: 20,
    width: "42%",
    marginLeft: "5%",
    marginTop: "auto",
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});
