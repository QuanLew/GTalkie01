import { View, Text, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, query, where } from 'firebase/firestore'
import { database } from '../../firebaseConfig'
import getUID from '../components/getUID'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { getDrafts } from '../components/getDraft'

// Get list of drafts
const Draft = ({ navigation }: any) => {
    const [drafts, setDrafts] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(false)
    const uid = getUID()

    useEffect(() => {
        setLoading(true)
        getDrafts(q).then(setDrafts);
        setRefreshing(false)
      },[])

    const q = query(collection(database, `users/${uid}/drafts/`),where("isDraft", "==", true), where("isDeleted", "==", false))


    const onRefresh = () => {
        //Clear old data of the list
        getDrafts(q).then(setDrafts);
    };

    const renderItem = (({item}) => {
        setRefreshing(true)

        return (
            <View>
                <TouchableOpacity onPress={() => navigation.navigate('DisplayDraft', {id: item.id})}>
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
            data={drafts}
            renderItem={renderItem}
            keyExtractor={data => data.id}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
        </View>
    )
}

export default Draft