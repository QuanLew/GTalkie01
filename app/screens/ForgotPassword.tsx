import React, { useState } from 'react'
import { Text, View, TextInput, Button,TouchableOpacity } from 'react-native'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { useNavigation } from '@react-navigation/native'

const ForgotPassword = ({ navigation }: any) => {
    const [email, setEmail] = useState('');

    const handleResetPassword = async () => {
        try{
            await sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log('You will receive an email with information for creating a new password')
                navigation.navigate('Login')
                console.log("Success")
            })

        }catch(e){
            console.log(e)
        }
    };

    return (
        <View>
            <View>
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text>Back</Text>
                    </TouchableOpacity>
                </View>
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