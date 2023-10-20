import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'; 

const Main = ({ navigation }: any) => {
  return (
    <View>
      <View>
        <Text>How can I help you?</Text>
      </View>

      <Image source={require('../../assets/images/robot.png')}/>

      <TouchableOpacity onPress={() => navigation.navigate('SendEmail')}>
        <MaterialIcons name="record-voice-over" size={24} color="black" />
      </TouchableOpacity>

    </View>
  )
}

export default Main;