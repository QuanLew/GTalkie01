import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { auth, database } from '../../firebaseConfig'
import getUID from '../components/getUID'
import getDraft from '../components/getDraft'
import { useIsFocused, useNavigation } from '@react-navigation/native'

//Get a single draft
const DisplayOneHistory = (item) => {
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
    

    return (
        <View>
            <Text>History</Text>
            <View>
                <Text>{draft.to}</Text>
                <Text>{draft.subject}</Text>
                <Text>{draft.date}</Text>
                <Text>{draft.content}</Text>
            </View>
            <View>
                <TouchableOpacity onPress={() => navigation.navigate('History')}>
                    <Text>Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default DisplayOneHistory