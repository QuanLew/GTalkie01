import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebaseConfig'

export default function Logout() {
    const handleLogout = async ()=>{
        await signOut(auth);
    }

  return (
    <View>
      <TouchableOpacity onPress={handleLogout}>
      <Text style={{
          fontSize: 16,
          textAlign: 'left',
          color: 'black',
          paddingLeft: 16,
          paddingBottom: 10
        }}>
            Log out</Text>
      </TouchableOpacity>
    </View>
  )
}