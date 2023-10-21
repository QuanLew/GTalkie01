import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { MaterialIcons } from '@expo/vector-icons'; 

export default function Logout() {
    const handleLogout = async ()=>{
        await signOut(auth);
    }

  return (
    <View>
      <TouchableOpacity onPress={handleLogout}>
      <MaterialIcons name="logout" size={24} color="black" />
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