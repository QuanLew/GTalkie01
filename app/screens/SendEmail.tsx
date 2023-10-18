import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import GoBack from '../components/GoBack'
import { auth } from '../../firebaseConfig'
import Dialog from "react-native-dialog";


const SendEmail = ({ navigation }: any) => {
    const [recipients, setRecipients] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    const showDialog = () => {
        setVisible(true);
    };


    const sender = auth.currentUser.email;

    const handleSubmit = async (e) => {
        if (!recipients || !subject || !content) {
            console.log('Recipients, subject or message is missing.')
        }
        showDialog();
        // try {
        //     setLoading(true);
        //     const data = await axios.post("http://localhost:4000/api/email", {
        //         sender,
        //         recipients,
        //         subject,
        //         content
        //     });
        //     setLoading(false);
        //     <Success />
        // } catch (e) {
        //     console.log(e.response.data.message);
        //     setLoading(false);
        // }
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
                <Dialog.Container visible={visible} onBackdropPress={() => setVisible(false)}>
                    <Dialog.Title>Oops</Dialog.Title>
                    <Dialog.Description>
                        Email address and password is required.
                    </Dialog.Description>
                </Dialog.Container>
            </TouchableOpacity>
        </View>
    )
}

export default SendEmail;