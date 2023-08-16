import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from 'firebase/compat/app';
import { getAuth } from "firebase/auth";
import { getStorage} from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYb3BIH8F4Qjanyp_CgwzgnTH5A4L2f1s",
  authDomain: "chat-85524.firebaseapp.com",
  projectId: "chat-85524",
  storageBucket: "chat-85524.appspot.com",
  messagingSenderId: "913424135672",
  appId: "1:913424135672:web:e2f98747c76237f2a3d20d",
  measurementId: "G-3LMGSEL3XD"
};
  if(!firebase.apps.length){
        firebase.initializeApp(firebaseConfig);
        console.log('firebase initialized');
    }
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export  {firebase};
export const storage = getStorage();
export const db=getFirestore(app);
    