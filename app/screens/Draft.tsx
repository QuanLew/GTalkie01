import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { collection, query, where } from 'firebase/firestore'
import { database } from '../../firebaseConfig'
import getUID from '../components/getUID'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { getDrafts } from '../components/getDraft'
import { useIsFocused } from '@react-navigation/native'
import theme from '../../theme'

// Get list of drafts
const Draft = ({ navigation }: any) => {
  const [drafts, setDrafts] = useState([])
  const [refreshing, setRefreshing] = useState(true)
  const isFocused = useIsFocused();

  const uid = getUID()

  useEffect(() => {
    isFocused
    getDrafts(q).then(setDrafts);
    setRefreshing(false)
  }, [isFocused])

  const q = query(collection(database, `users/${uid}/drafts/`), where("isDraft", "==", true), where("isDeleted", "==", false))


  const onRefresh = () => {
    //Clear old data of the list
    getDrafts(q).then(setDrafts);
    setRefreshing(false)
  };

  const renderItem = (({ item }) => {
    return (
      <View style={{ marginHorizontal: 20, padding: 5, paddingVertical: 15, borderBottomWidth: 0.5 }}>
        <TouchableOpacity onPress={() => navigation.navigate('DisplayDraft', { id: item.id })}>
          <View style={{ flexDirection: 'row', alignItems: "center" }}>
            <Text style={styles.title}>To: </Text>
            <Text style={styles.paragraph}>{item.to}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: "center" }}>
            <Text numberOfLines={1} style={styles.title}>Subject: <Text  style={styles.paragraph}>{item.subject}</Text></Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: "center" }}>
            <Text style={styles.title}>Date: </Text>
            <Text style={styles.paragraph}>{item.date}</Text>
          </View>
          <Text numberOfLines={1} style={styles.title}>Content: <Text style={styles.paragraph}>{item.content}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    )
  })

  return (
    <View style={[styles.container]}>
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

const styles = StyleSheet.create({
  checkbox: {
    margin: 8,
  },
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: theme.colors.background,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: theme.colors.textPrimary,
    fontWeight: "bold"
  },
  paragraph: {
    color: theme.colors.textPrimary,
    fontFamily: "Fredoka",
    fontSize: 20,

  },
})