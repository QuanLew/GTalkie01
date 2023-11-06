import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, database } from '../../firebaseConfig'
import Dialog from "react-native-dialog";
import { AntDesign } from '@expo/vector-icons'; 
import getUID from '../components/getUID';
import { doc, setDoc } from 'firebase/firestore';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


const SendEmail = ({ navigation }: any) => {
    const [recipients, setRecipients] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [visible, setVisible] = useState(false);
    const [email, setEmail] = useState([]);

    const uid = getUID()

    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds(); //Current Seconds
        setCurrentDate(
        date + '/' + month + '/' + year 
        + ' ' + hours + ':' + min + ':' + sec
        );
    }, []);

    const showDialog = () => {
        setVisible(true);
    };

    const handleEmail = (email) => {
        console.log("I got email: " + email)
        setRecipients(email)
    }

    const sender = auth.currentUser.email;

    const handleSubmit = async (e) => {
        if (!recipients || !subject || !content) {
            Alert.alert('Oops', 'Recipients, subject or message is missing.', [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ]);
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


    const saveDraft = async () => {
        if (recipients && subject && content) {
            const draft = { 
                id: uuidv4(),
                to: recipients,
                subject: subject,
                content: content,
                date: currentDate
            }
            await setDoc(doc(database,`users/${uid}/drafts/${draft.id}`), draft)
                .then(docRef => {
                    Alert.alert('Nice work!', 'Draft saved.', [
                        {text: 'OK', onPress: () => console.log('OK Pressed')},
                      ]);
                    setRecipients("")
                    setSubject("")
                    setContent("")
                })
            .catch(error => {
                Alert.alert('Oops', error, [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                  ]);
            })
        } else {
            Alert.alert('Oops', 'Email is incompleted.', [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ]);
        }
    }

    return (
        <View>
            <View>
                <View>
                    <Text>To: </Text>
                    <TextInput autoCapitalize='none' clearTextOnFocus value={recipients} placeholder='abc@gmail.com' onChangeText={value=> setRecipients(value)} keyboardAppearance='default'/>
                    <AntDesign name="contacts" size={24} color="black" onPress={() => {
                        /* 1. Navigate to the Details route with params */
                        navigation.navigate('ContactList', { callback: handleEmail })
                        }}/>
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

            <TouchableOpacity onPress={saveDraft}>
                <Text>Save Draft</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SendEmail;

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 20
	},
	contact: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center'
	},
	contactText: {
		flex: 1,
		paddingHorizontal: 4,
		height: 40,
		borderWidth: 1,
		borderRadius: 4,
		padding: 10,
	},
	contactContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		padding: 10,
		marginVertical: 4
	}
});