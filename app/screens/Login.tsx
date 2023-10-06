import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native'
import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig'


const Login = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if(email && password){
            try {
                setLoading('true')
                const user = await signInWithEmailAndPassword(auth, email, password);
                console.log("Login: ", user)
            } catch(e) {
                console.log(e)
            }
        } else {
            // show error
            console.log("Missing email or password")
        }
    };

    return (
        <View>
            <View>
                <Image source={require('../../assets/images/robot.png')} />
                <Text>Welcome to G-Talkie</Text>
                <Text>Make our life become easier</Text>
            </View>

            <View>
                <TextInput autoCapitalize='none' clearTextOnFocus value={email} placeholder='Email' onChangeText={value=> setEmail(value)} />
                <TextInput autoCapitalize='none' clearTextOnFocus value={password} placeholder='Password' secureTextEntry onChangeText={value=> setPassword(value)} />
                
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text>Forgot password?</Text>
                </TouchableOpacity>

                <View>
                    <TouchableOpacity onPress={handleSubmit} >
                        <Text>LOGIN</Text>
                    </TouchableOpacity>
                            
                    <Text>OR</Text>
                    <Text>google twitter blah blah</Text>
                </View>

                <View>
                    <Text> 
                        Don't have an account?
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text>Sign up</Text>
                        </TouchableOpacity>
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default Login;