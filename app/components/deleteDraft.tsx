import { View, Text } from 'react-native'
import React from 'react'
import { deleteDoc, doc } from 'firebase/firestore';
import { database } from '../../firebaseConfig';
import getUID from './getUID';

export default async function deleteDraft(draft) {
    const uid = getUID()

    await deleteDoc(doc(database, `users/${uid}/drafts/` + draft));
}