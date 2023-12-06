import { View, Text, Alert, StyleSheet, TextInput } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { auth, database } from '../../firebaseConfig'
import getUID from '../components/getUID'
import getDraft from '../components/getDraft'
import { markDeleteDraft } from '../components/deleteDraft'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import axios from 'axios';
import theme from '../../theme'

//Get a single draft

const DisplayDraft = (item) => {
    const [draft, setDraft] = useState([])
    const [loading, setLoading] = useState(false);
    const isFocused = useIsFocused();

    const id = item.route.params.id
    const uid = getUID()
    const navigation = useNavigation()

    const [current, setCurrent] = useState('')

    useEffect(() => {
        isFocused
        getDraft(q).then(setDraft)
    }, [isFocused])

    const q = query(collection(database, `users/${uid}/drafts/`), where("id", "==", `${id}`))

    const sender = auth.currentUser.email;

    async function handleSubmit() {
        try {
            setLoading(true);
            const data = await axios.post("http://localhost:4000/api/email", {
                sender,
                recipients: draft.to,
                subject: draft.subject,
                content: draft.content,
            });
            setLoading(false);
            const sentDraft = {
                id: uuidv4(),
                to: recipients,
                subject: subject,
                content: content,
                date: currentDate,
                time: currentTime,
                isDraft: false,
                isDeleted: false,
                isStarred: false
            }
            await setDoc(doc(database, `users/${uid}/drafts/${sentDraft.id}`), sentDraft)
            Alert.alert('Whoosh!', 'Send successfully.', [
                { text: 'OK', onPress: () => console.log('SENT.') },
            ]);
            navigation.goBack()
        } catch (e) {
            console.log(e.response.data.message);
            setLoading(false);
        }
    }

    async function markDelete() {
        try {
            const draftID = draft.id
            markDeleteDraft(draftID)
            Alert.alert('Succeed!', 'Your draft is deleted', [
                { text: 'OK', onPress: () => console.log('MARK DELETE SUCCEED') },
            ])
            navigation.goBack()
        } catch (e) {
            Alert.alert('Oops!', e, [
                { text: 'OK', onPress: () => console.log('MARK DELETE FAILED') },
            ])
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ alignItems: "flex-end", paddingRight: "5%" }}>
                <TouchableOpacity style={{
                    backgroundColor: "#DF7E7E",
                    borderRadius: 8,
                    padding: 10,
                }} onPress={() => navigation.navigate('Drafts')}>
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 20, padding: 5, paddingVertical: 15 }}>
                <View style={{ flexDirection: 'row', padding: 5, borderBottomWidth: 0.5 }}>
                    <Text style={styles.title}>To: </Text>
                    <TextInput style={styles.paragraph}>{draft.to}</TextInput>
                </View>
                <View style={{ flexDirection: 'row', padding: 5, borderBottomWidth: 0.5 }}>
                    <Text style={styles.title}>Subject: </Text>
                    <TextInput style={styles.paragraph}>{draft.subject}</TextInput>
                </View>
                <View style={{ flexDirection: 'row', padding: 5, borderBottomWidth: 0.5 }}>
                    <Text style={styles.title}>Date: </Text>
                    <Text style={styles.paragraph}>{draft.date}</Text>
                </View>
                <View style={{ padding: 5, borderBottomWidth: 0.5, height: "70%" }}>
                    <Text style={styles.title}>Content:
                    </Text>
                    <TextInput multiline style={styles.paragraph}>{draft.content}</TextInput>
                </View>
            </View>
            <View style={{
                marginTop: -70, rowGap: 20, alignSelf: 'center'

            }}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={markDelete}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default DisplayDraft

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

