import { View, Text, FlatList, Button, SafeAreaView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DocumentData, collection, getDocs, query } from 'firebase/firestore'
import { database } from '../../firebaseConfig'
import getUID from '../components/getUID'

const Draft = () => {
    const [drafts, setDrafts] = useState([])
    const [refreshing, setRefreshing] = useState(true);
    const uid = getUID()

    useEffect(() => {
        getDrafts().then(setDrafts);
      },[])

    async function getDrafts () {
        const q = query(collection(database, `users/${uid}/drafts/`))

        let myDrafts: DocumentData[] = [];
        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                myDrafts.push(doc.data())
            });
            console.log(myDrafts)
        } catch (e) {
            console.error(e);
        }
        setRefreshing(false)
        return myDrafts
    }

    const onRefresh = () => {
        //Clear old data of the list
        getDrafts().then(setDrafts);
    };
    
    return (
        <View>
            <FlatList
            data={drafts}
            renderItem={({item}) => (
                <View>
                    <Text>To: {item.to}</Text>
                    <Text>Subject: {item.subject}</Text>
                    <Text>{item.date}</Text>
                </View>
            )}
            keyExtractor={data => data.id}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
        </View>
    )
}

export default Draft