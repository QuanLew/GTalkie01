import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import CheckBox from 'expo-checkbox'
import { StyleSheet } from 'react-native';

const Signup = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reenter_password, setReEnterPassword] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const handleSubmit = async ()=>{
      if(email && password && password == reenter_password && toggleCheckBox){
          try{
              await createUserWithEmailAndPassword(auth, email, password);
              await signOut(auth)
          }catch(e){
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