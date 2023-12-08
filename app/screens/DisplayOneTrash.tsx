import { View, Text, Alert, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { auth, database } from '../../firebaseConfig'
import getUID from '../components/getUID'
import getDraft from '../components/getDraft'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import deleteDraft, { recoverDraft } from '../components/deleteDraft'
import theme from '../../theme'

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
            navigation.goBack()
        } catch (e) {
            Alert.alert('Oops!', e, [
                {text: 'OK', onPress: () => console.log('DELETE FAILED')},
            ])
        }
    }

    return (
        <View style={styles.container}>
            <View style={{alignItems: "flex-end", paddingRight:"5%"}}>
            <TouchableOpacity style={{
                backgroundColor: "#DF7E7E",
                borderRadius: 8,
                padding: 10,
            }} onPress={() => navigation.navigate('Trash')}>
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 20, padding: 5, paddingVertical: 15 }}>
                <View style={{ flexDirection: 'row', padding: 5, borderBottomWidth: 0.5 }}>
                    <Text style={styles.title}>To: </Text>
                    <Text style={styles.paragraph}>{draft.to}</Text>
                </View>
                <View style={{ flexDirection: 'row', padding: 5, borderBottomWidth: 0.5 }}>
                    <Text style={styles.title}>Subject: </Text>
                    <Text style={styles.paragraph}>{draft.subject}</Text>

                </View>
                <View style={{ flexDirection: 'row', padding: 5, borderBottomWidth: 0.5 }}>
                    <Text style={styles.title}>Date: </Text>
                    <Text style={styles.paragraph}>{draft.date}</Text>
                </View>
                <View style={{ flexDirection: 'row', padding: 5, borderBottomWidth: 0.5, height: "70%" }}>

                    <Text style={styles.title}>Content: <Text style={styles.paragraph}>{draft.content}</Text>
                    </Text>
                </View>
            </View>
            <View style={{
                marginTop: -70, rowGap: 20, alignSelf: 'center'

            }}>
                <TouchableOpacity style={styles.button} onPress={recoverTrash}>
                    <Text style={styles.buttonText}>Restore</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={deleteTrash}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default DisplayOneTrash

const styles = StyleSheet.create({

    container: {
        height: "100%",
        backgroundColor: theme.colors.background,
    },
    title: {
        fontSize: 20,
        color: theme.colors.textPrimary,
        fontFamily: "Fredoka",
    },
    paragraph: {
        color: theme.colors.textPrimary,
        fontFamily: "Fredoka",
        fontSize: 20,

    },
    button: {
        backgroundColor: "#DF7E7E",
        borderRadius: 8,
        padding: 20,
        width: "100%",
        paddingHorizontal: "30%"
    },
    buttonText: {
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold",
    },
})