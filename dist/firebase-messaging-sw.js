/* eslint-disable no-undef */
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyAAoWo0hEu3t5rXM1TbP9xQVxpKp4d0psI",
    authDomain: "kisanbazaar-1b2bc.firebaseapp.com",
    projectId: "kisanbazaar-1b2bc",
    storageBucket: "kisanbazaar-1b2bc.firebasestorage.app",
    messagingSenderId: "230716705602",
    appId: "1:230716705602:web:31cdf0c823459b78f516db"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/images/logo.png' // Ensure this path is correct
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
