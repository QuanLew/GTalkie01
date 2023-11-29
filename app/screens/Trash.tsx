import { View, Text, FlatList, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, query, where } from 'firebase/firestore'
import { database } from '../../firebaseConfig'
import getUID from '../components/getUID'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { getDrafts } from '../components/getDraft'
import deleteDraft from '../components/deleteDraft'

// Get list of drafts
const Trash = ({ navigation }: any) => {
    const [trash, setTrash] = useState([])
    const [refreshing, setRefreshing] = useState(true);
    const uid = getUID()

    useEffect(() => {
        getDrafts(q).then(setTrash);
        setRefreshing(false)
      },[])

    const q = query(collection(database, `users/${uid}/drafts/`),where("isDraft", "==", true), where("isDeleted", "==", true))

    const onRefresh = () => {
        //Clear old data of the list
        getDrafts(q).then(setTrash);
    };

    async function handleDelete(draftID) {
        try {
            deleteDraft(draftID)
            Alert.alert('Succeed!', 'Your draft is deleted', [
                {text: 'OK', onPress: () => console.log('DELETE SUCCEED')},
            ])
        } catch(e) {
            Alert.alert('Oops!', e, [
                {text: 'OK', onPress: () => console.log('DELETE FAILED')},
            ])
        }
    }

    const renderItem = (({item}) => {
        return (
            <View>
                <TouchableOpacity>
                    <Text>To: {item.to}</Text>
                    <Text>Subject: {item.subject}</Text>
                    <Text>{item.date}</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={handleDelete(item.id)}>
                <Text>Delete</Text>
                </TouchableOpacity> */}
            </View>
        )
    })
    
    return (
        <View>
            <FlatList
            data={trash}
            renderItem={renderItem}
            keyExtractor={data => data.id}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
        </View>
    )
}

export default Trash