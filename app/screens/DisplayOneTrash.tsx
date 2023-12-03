import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { auth, database } from '../../firebaseConfig'
import getUID from '../components/getUID'
import getDraft from '../components/getDraft'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import deleteDraft, { recoverDraft } from '../components/deleteDraft'

//Get a single draft
const DisplayOneTrash = (item) => {
    const [draft, setDraft] = useState([])
    const isFocused = useIsFocused();

    const id = item.route.params.id
    const uid = getUID()
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    useEffect(() => {
        isFocused
        getDraft(q).then(setDraft)
    },[isFocused])

    const q = query(collection(database, `users/${uid}/drafts/`), where("id", "==", `${id}`))
    
    const sender = auth.currentUser.email;

    async function recoverTrash () {
        try {
            const draftID = draft.id
            recoverDraft(draftID)
            Alert.alert('Succeed!', 'Your trash is recovered', [
                {text: 'OK', onPress: () => console.log('RECOVER SUCCEED')},
            ])
            navigation.navigate('Trash')
        } catch (e) {
            Alert.alert('Oops!', e, [
                {text: 'OK', onPress: () => console.log('RECOVER FAILED')},
            ])
        }
    }

    async function deleteTrash () {
        try {
            const draftID = draft.id
            deleteDraft(draftID)
            Alert.alert('Succeed!', 'Your trash is deleted', [
                {text: 'OK', onPress: () => console.log('DELETE SUCCEED')},
            ])
            navigation.navigate('Trash')
        } catch (e) {
            Alert.alert('Oops!', e, [
                {text: 'OK', onPress: () => console.log('DELETE FAILED')},
            ])
        }
    }

    return (
        <View>
            <Text>Trash can</Text>
            <View>
                <Text>{draft.to}</Text>
                <Text>{draft.subject}</Text>
                <Text>{draft.date}</Text>
                <Text>{draft.content}</Text>
            </View>
            <View>
                <TouchableOpacity onPress={recoverTrash}>
                    <Text>Restore</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={deleteTrash}>
                    <Text>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Trash')}>
                    <Text>Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default DisplayOneTrash