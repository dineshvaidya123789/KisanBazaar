import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAAoWo0hEu3t5rXM1TbP9xQVxpKp4d0psI",
    authDomain: "kisanbazaar-1b2bc.firebaseapp.com",
    projectId: "kisanbazaar-1b2bc",
    storageBucket: "kisanbazaar-1b2bc.firebasestorage.app",
    messagingSenderId: "230716705602",
    appId: "1:230716705602:web:31cdf0c823459b78f516db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
// Check if supported first to avoid errors on some browsers/Safari versions
import { getMessaging, isSupported } from "firebase/messaging";
let messaging;
isSupported().then(supported => {
    if (supported) {
        messaging = getMessaging(app);
    }
}).catch(err => console.log('Messaging not supported', err));

export { db, auth, messaging };
