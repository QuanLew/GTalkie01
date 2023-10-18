import { View, Text, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import CheckBox from 'expo-checkbox'
import { StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, updateProfile } from 'firebase/auth';
import { auth, storage } from '../../firebaseConfig';

const Signup = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [reenter_password, setReEnterPassword] = useState('');
    const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const [image, setImage] = useState(null);
    
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
            setImage(imgURI)
        }
    };

    const uploadImage = async (uri) => {
        const auth = getAuth()
        const user = auth.currentUser

        const blob: any = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(xhr.response);
            };
            xhr.onerror = function() {
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        })

        const ref = storage.ref(storage.getStorage(), 'images/')
        
        const uploadTask = storage.uploadBytes(ref, blob)

        storage.getDownloadURL(ref).then((url =>{
            updateProfile(user, { photoURL: url })
          }))
      }

    const handleSubmit = async ()=>{
        if(email && password && password == reenter_password && toggleCheckBox){
            try {
                    await createUserWithEmailAndPassword(auth, email, password)
                    await uploadImage(image)
                    await signOut(auth)
            } catch(e) {
                console.log(e)
            }
        } else if(email && password && password == reenter_password && !toggleCheckBox) {
            console.log('Please agree to the Terms and Conditions')
        } else if(password != reenter_password) {
            console.log('Please make sure your passwords match')
        } else {
            console.log('Please enter email and password')
        }
    }

  return (
    <View>
      <View>
          <View >
              <View >
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                      <Text>Back</Text>
                  </TouchableOpacity>
              </View>
              <Text>Let's Get Started</Text>
          </View>
          <View>
              
          <View >
                {
                image  && <Image source={{ uri: image, cache: 'force-cache' }} style={{ width: 110, height: 110 }} />
                }
                    <TouchableOpacity onPress={pickImage} >
                        <Text>{image ? 'Edit' : 'Upload'} Image</Text>
                        <AntDesign name="camera" size={20} color="black" />
                    </TouchableOpacity>

                </View>

              <TextInput autoCapitalize='none' clearTextOnFocus value={email} placeholder='Email' onChangeText={value=> setEmail(value)}/>
              <TextInput autoCapitalize='none' clearTextOnFocus value={password} placeholder='Password' secureTextEntry onChangeText={value=> setPassword(value)} />
              <TextInput autoCapitalize='none' clearTextOnFocus value={reenter_password} placeholder='Confirm Password' secureTextEntry onChangeText={value=> setReEnterPassword(value)} />
              <CheckBox
                style={styles.checkbox}
                value={toggleCheckBox}
                color={toggleCheckBox ? '#4630EB' : undefined}
                onValueChange={newValue => setToggleCheckBox(newValue)}
              />
              <Text>By clicking here, I state that I have read and understood the terms and conditions</Text>
          </View>
      </View>
      
      <View>
        <TouchableOpacity onPress={handleSubmit} >
            <Text>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <View >
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text>Sign in</Text>
          </TouchableOpacity>
      </View>
    </View>
)
}

export default Signup;

const styles = StyleSheet.create({
  checkbox: {
    margin: 8,
  }
});

