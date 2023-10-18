import { View, Text, Image } from 'react-native'
import React from 'react'
import GoBack from "../components/GoBack";
import { getAuth } from 'firebase/auth';

const Profile = ({navigation}: {navigation: any}) => {
    const auth = getAuth()
    const user = auth.currentUser

    return (
          <View>
            <GoBack />
            <Text>Profile</Text>
              <View>
                { 
                user.photoURL ? 
                <Image source={{ uri: user.photoURL }} style={{ width: 110, height: 110 }} /> : 
                <Image source={require('../../assets/images/robot.png')} style={{ width: 110, height: 110 }} />  
                }
              </View>
              <Text>Email {user.email}</Text>

            </View>
)
}

export default Profile;