import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 
import theme from '../../theme';

const Main = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <View>
        <Text>How can I help you?</Text>
      </View>

      <Image source={require('../../assets/images/robot.gif')}/>

      <TouchableOpacity>
        <MaterialIcons name="record-voice-over" size={24} color="black" />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('SendEmail')}>
        <FontAwesome5 name="keyboard" size={24} color="black" />
      </TouchableOpacity>
    </View>
  )
}

export default Main;

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