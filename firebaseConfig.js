import { initializeApp, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, orderBy, query, onSnapshot, getFirestore, initializeFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDr9VTEiXkB8l5RFobylIB5wqg9pWxSHW4",
  authDomain: "gtalkie-6c79a.firebaseapp.com",
  projectId: "gtalkie-6c79a",
  storageBucket: "gtalkie-6c79a.appspot.com",
  messagingSenderId: "979240525228",
  appId: "1:979240525228:web:68942e41dd29cc49f72e09",
  measurementId: "G-VL3SXGET42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
};

const firestore = {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot
};

const auth = getAuth(app);

const database = getFirestore();

// const database = initializeFirestore(app, {
//   experimentalAutoDetectLongPolling: true
// })

export { auth, storage, firestore, database };