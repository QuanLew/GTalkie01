import { View, Text, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { auth, database } from '../../firebaseConfig'
import getUID from '../components/getUID'
import getDraft from '../components/getDraft'
import { markDeleteDraft } from '../components/deleteDraft'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import axios from 'axios';

//Get a single draft
const DisplayDraft = (item) => {
    const [draft, setDraft] = useState([])
    const [loading, setLoading] = useState(false);
    const isFocused = useIsFocused();

    const id = item.route.params.id
    const uid = getUID()
    const navigation = useNavigation()

    useEffect(() => {
        isFocused
        getDraft(q).then(setDraft)
    },[isFocused])

    const q = query(collection(database, `users/${uid}/drafts/`), where("id", "==", `${id}`))
    
    const sender = auth.currentUser.email;

    async function handleSubmit () {
        try {
            setLoading(true);
            const data = await axios.post("http://localhost:4000/api/email", {
                sender,
                recipients: draft.to,
                subject: draft.subject,
                content: draft.content,
            });
            setLoading(false);
            Alert.alert('Whoosh!', 'Send successfully.', [
                {text: 'OK', onPress: () => console.log('SENT.')},
              ]);
            navigation.goBack()
        } catch (e) {
            console.log(e.response.data.message);
            setLoading(false);
        }
    }

    async function markDelete () {
        try {
            const draftID = draft.id
            markDeleteDraft(draftID)
            Alert.alert('Succeed!', 'Your draft is deleted', [
                {text: 'OK', onPress: () => console.log('MARK DELETE SUCCEED')},
            ])
            navigation.goBack()
        } catch (e) {
            Alert.alert('Oops!', e, [
                {text: 'OK', onPress: () => console.log('MARK DELETE FAILED')},
            ])
        }
    }

    return (
        <View>
            <Text>Display Draft</Text>
            <View>
                <Text>{draft.to}</Text>
                <Text>{draft.subject}</Text>
                <Text>{draft.date}</Text>
                <Text>{draft.content}</Text>
            </View>
            <View>
                <TouchableOpacity onPress={handleSubmit}>
                    <Text>Send</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={markDelete}>
                    <Text>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Drafts')}>
                    <Text>Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default DisplayDraft