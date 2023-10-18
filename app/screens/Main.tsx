import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebaseConfig'

const Main = ({ navigation }: any) => {
  const handleLogout = async ()=>{
    await signOut(auth);
  }

  return (
    <View>
      <View>
        <Text>How can I help you?</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text>Log out</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Text>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SendEmail')}>
        <Text>Send Email</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Main;