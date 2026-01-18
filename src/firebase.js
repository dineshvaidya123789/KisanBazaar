// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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
const db = getFirestore(app);

export { db };
