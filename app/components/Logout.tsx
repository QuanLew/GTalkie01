import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { MaterialIcons } from '@expo/vector-icons'; 
import theme from '../../theme';

export default function Logout() {
    const handleLogout = async ()=>{
        await signOut(auth);
    }

  return (
    <View >
      <TouchableOpacity  style={{ flexDirection: "row"}} onPress={handleLogout}>
      <MaterialIcons name="logout" size={20} color="#D6665C" />
      <Text style={[styles.paragraph ,{
          textAlign: 'center',
          paddingLeft: 5,
          paddingBottom: 10
        }]}>
            Log out</Text>
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
  checkbox: {
    margin: 8,
  },
  container: {
    height: "100%",
    backgroundColor: theme.colors.background,
  },
  paragraph: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold"

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