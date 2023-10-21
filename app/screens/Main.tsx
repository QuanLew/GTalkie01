import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 

const Main = ({ navigation }: any) => {
  return (
    <View style={styles.root}>
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
  root: {
    backgroundColor: 'white'
  }
  })