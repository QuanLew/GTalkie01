import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, database, storage } from '../../firebaseConfig'
import Dialog from "react-native-dialog";
import { AntDesign } from '@expo/vector-icons'; 
import getUID from '../components/getUID';
import { collection, doc, getDocs, query, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const SendEmail = ({ navigation }: any) => {
    const [recipients, setRecipients] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [visible, setVisible] = useState(false);
    const [email, setEmail] = useState([]);
    const [draft, setDraft] = useState([]);

    const uid = getUID()

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
        // const ref = query(collection(database, `users/${uid}/drafts`))
        //     const querySnapshot = await getDocs(ref);
        //     setDraft(querySnapshot.docs.map((doc) => ({
        //         // doc.data() is never undefined for query doc snapshots
        //         // console.log(doc.id, " => ", doc.data().name);
        //         id: doc.id,
        //         data: doc.data().name
        //     })
        // ))
        const draft = { 
            id: Math.random(),           
            to: recipients,
            subject: subject,
            content: content
        }
        
        await setDoc(doc(database,`users/${uid}/drafts/${draft.id}`), draft)
            .then(docRef => {
                console.log("Draft saved.")
            })
        .catch(error => {
            console.log("Error" + error);
        })
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

            {/* TODO: save to draft */}
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