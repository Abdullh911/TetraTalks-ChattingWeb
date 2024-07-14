import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, addDoc, getDocs, query, where,updateDoc,getDoc ,onSnapshot} from 'firebase/firestore';
import 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyAkl9y49_yD9lNsLfLtVWaCtV8nDCRDf9U",
    authDomain: "tetratalks-9f694.firebaseapp.com",
    projectId: "tetratalks-9f694",
    storageBucket: "tetratalks-9f694.appspot.com",
    messagingSenderId: "367976855075",
    appId: "1:367976855075:web:202c1221a3b756e308e396"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const usersCollection = collection(firestore, 'users'); 

export { firestore, usersCollection, addDoc, doc, getDocs, query, where,updateDoc,getDoc,onSnapshot };

