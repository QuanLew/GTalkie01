import { View, Text, FlatList, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, query, where } from 'firebase/firestore'
import { database } from '../../firebaseConfig'
import getUID from '../components/getUID'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { getDrafts } from '../components/getDraft'
import { useIsFocused } from '@react-navigation/native'

// Get list of drafts
const Trash = ({ navigation }: any) => {
    const [trash, setTrash] = useState([])
    const [refreshing, setRefreshing] = useState(true);
    const isFocused = useIsFocused()
    
    const uid = getUID()

    useEffect(() => {
        isFocused
        getDrafts(q).then(setTrash);
        setRefreshing(false)
      },[isFocused])

    const q = query(collection(database, `users/${uid}/drafts/`),where("isDraft", "==", true), where("isDeleted", "==", true))

    const onRefresh = () => {
        getDrafts(q).then(setTrash);
    };

    const renderItem = (({item}) => {
        return (
            <View>
                <TouchableOpacity onPress={() => navigation.navigate('DisplayOneTrash', {id: item.id})}>
                    <Text>To: {item.to}</Text>
                    <Text>Subject: {item.subject}</Text>
                    <Text>{item.date}</Text>
                </TouchableOpacity>
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