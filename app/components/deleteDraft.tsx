import { deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { database } from '../../firebaseConfig';
import getUID from './getUID';

export default async function deleteDraft(draft) {
    const uid = getUID()

    await deleteDoc(doc(database, `users/${uid}/drafts/` + draft));
}

export async function markDeleteDraft(draft) {
    const uid = getUID()

    await updateDoc(doc(database, `users/${uid}/drafts/` + draft),
    {
        isDeleted: true
    });
}