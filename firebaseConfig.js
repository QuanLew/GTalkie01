import { initializeApp, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, orderBy, query, onSnapshot, getFirestore, initializeFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBqABW_Gu37FChUsVNh8-4Aof5ohAaLYc",
  authDomain: "g-talkie.firebaseapp.com",
  projectId: "g-talkie",
  storageBucket: "g-talkie.appspot.com",
  messagingSenderId: "226391179834",
  appId: "1:226391179834:web:e2f0cd313cf6acce432b03"
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