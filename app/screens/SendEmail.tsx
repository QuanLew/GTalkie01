import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import GoBack from '../components/GoBack'
import axios from 'axios'

const SendEmail = ({ navigation }: any) => {
    const [recipients, setRecipients] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        if (!recipients || !subject || !content) {
            // return toast.error
            console.log('Please fill recipients, subject and content')
        }
        try {
            setLoading(true);
            const { data } = await axios.post(`/api/email`, {
                recipients,
                subject,
                content
            });
            setLoading(false);
            //toast.success(data.message);
        } catch (e) {
            console.log(e)
            setLoading(false);
        }
    }

    return (
        <View>
            <GoBack />
            
            <View>
                <TextInput autoCapitalize='none' clearTextOnFocus value={recipients} placeholder='Recipients' onChangeText={value=> setRecipients(value)} />
                <TextInput autoCapitalize='none' clearTextOnFocus value={subject} placeholder='Subject' onChangeText={value=> setSubject(value)} />
                <TextInput autoCapitalize='none' clearTextOnFocus value={content} placeholder='Content' onChangeText={value=> setContent(value)} />
            </View>

            <TouchableOpacity onPress={handleSubmit}>
                <Text>Send</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SendEmail;