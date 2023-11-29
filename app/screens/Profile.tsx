import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../firebaseConfig';
import { getAuth, updateProfile } from 'firebase/auth';

const Profile = ({ navigation }: any) => {
  const [isLoading, setLoading] = useState(false);
  const auth = getAuth()
  const user = auth.currentUser
  
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
        imgURI = user.photoURL
        setLoading(false)
      }

      setLoading(true)

      const blob: any = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            resolve(xhr.response);
        };
        xhr.onerror = function() {
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', imgURI, true);
        xhr.send(null);
      })

      const ref = storage.ref(storage.getStorage(), 'images/' + user.uid)
      
      await storage.uploadBytes(ref, blob)

      const url = await storage.getDownloadURL(ref)

      await updateProfile(user, { photoURL: url }).then((res) => {
        setLoading(false);
      }).catch((err) =>  setLoading(false));
  };

  return (
    <View>
        <View>
          <TouchableOpacity onPress={pickImage}>
            {isLoading && <ActivityIndicator size="small" color="#0000ff" />}
            { 
            user.photoURL ? 
              <Image source={{ uri: user.photoURL }} style={{ width: 110, height: 110 }} /> : 
              <Image source={require('../../assets/images/anon.png')} style={{ width: 110, height: 110 }} />  
            }
            <AntDesign name="camera" size={20} color="black" />
          </TouchableOpacity>
        </View>
        {/* <Text>User ID {user.uid}</Text> */}
        <Text>Email {user.email}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text>Reset password</Text>
        </TouchableOpacity>
      </View>
  )
}

export default Profile;