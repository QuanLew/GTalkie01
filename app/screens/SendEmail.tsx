import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import GoBack from '../components/GoBack'
import axios from 'axios'
import { auth } from '../../firebaseConfig'

const SendEmail = ({ navigation }: any) => {
    const [recipients, setRecipients] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const sender = auth.currentUser.email;

    const handleSubmit = async (e) => {
        if (!recipients || !subject || !content) {
            console.log('Recipients, subject or message is missing.')
        }
        try {
            setLoading(true);
            const data = await axios.post("http://localhost:4000/api/email", {
                sender,
                recipients,
                subject,
                content
            });
            setLoading(false);
            //toast.success(data.message);
        } catch (e) {
            console.log(e.response.data.message);
            setLoading(false);
        }
    }

    return (
        <View>
            <GoBack />
            
            <View>
                <View>
                    <Text>To: </Text>
                    <TextInput autoCapitalize='none' clearTextOnFocus value={recipients} placeholder='abc@gmail.com' onChangeText={value=> setRecipients(value)} keyboardAppearance='default'/>
                </View>
                <View>
                    <Text>Subject: </Text>
                    <TextInput autoCapitalize='sentences' clearTextOnFocus value={subject} placeholder='Subject' onChangeText={value=> setSubject(value)} keyboardAppearance='default' multiline/>
                </View>
                <View>
                    <Text>Message: </Text>
                    <TextInput autoCapitalize='sentences' clearTextOnFocus value={content} placeholder='Message' onChangeText={value=> setContent(value)} keyboardAppearance='default' multiline />
                </View>

            </View>

            <TouchableOpacity onPress={handleSubmit}>
                <Text>Send</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SendEmail;