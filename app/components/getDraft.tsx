import { Alert } from 'react-native'
import { DocumentData, getDocs } from 'firebase/firestore';

export default async function getDraft(q) {
    let myDraft = null
    
    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            myDraft = doc.data()
        });
    } catch (e) {
        console.error(e)
        Alert.alert('Oops!', e, [
            {text: 'OK', onPress: () => console.log('Error during getting list of drafts')},
            ])
    }

    return myDraft
}

export async function getDrafts (q) {
    let myDrafts: DocumentData[] = [];
    
    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            myDrafts.push(doc.data())
        });
        console.log(myDrafts)
    } catch (e) {
        console.error(e)
        Alert.alert('Oops!', e, [
            {text: 'OK', onPress: () => console.log('Error during getting one draft')},
          ])
    }
    return myDrafts
}