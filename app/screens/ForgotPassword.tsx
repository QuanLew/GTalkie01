import React, { useState } from 'react'
import { Text, View, TextInput, Button, Alert } from 'react-native'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import GoBack from '../components/GoBack'

const ForgotPassword = ({ navigation }: any) => {
    const [email, setEmail] = useState('');

    const handleResetPassword = async () => {
        try{
            await sendPasswordResetEmail(auth, email)
            .then(() => {
                Alert.alert('Thank you', 'You will receive an email with information for creating a new password', [
                    {text: 'OK', onPress: () => console.log('Ack')},
                  ]);
                navigation.navigate('Login')
            })
        }catch(e){
            console.log(e)
        }
    };

    return (
        <View>
            <View>
                <GoBack />
                <Text>Reset Password</Text>
            </View>
            
            <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder="Enter email address"
                autoCapitalize="none"
                placeholderTextColor="#aaa"
            />

            <Button title="Reset Password" onPress={handleResetPassword} disabled={!email} />
        </View>
    );
}

export default ForgotPassword;