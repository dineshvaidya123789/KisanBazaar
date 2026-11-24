// LOCAL TEST ONLY: same exports as src/firebase.js, but wired to the Firebase emulators. Never imported by the real app.
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, signInWithPhoneNumber, signOut } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const app = initializeApp({ apiKey: 'fake', authDomain: 'localhost', projectId: 'demo-kisanbazaar', storageBucket: 'demo-kisanbazaar.appspot.com', appId: 'fake' });
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
connectFirestoreEmulator(db, '127.0.0.1', 9137);
connectAuthEmulator(auth, 'http://127.0.0.1:9190', { disableWarnings: true });
connectStorageEmulator(storage, '127.0.0.1', 9139);
connectFunctionsEmulator(getFunctions(app, 'asia-south1'), '127.0.0.1', 5001);
auth.settings.appVerificationDisabledForTesting = true;
const messaging = undefined;

// Test helper: window.__signIn('+919987917394') signs in through the emulator with no real SMS.
window.__signIn = async (phone) => {
    const fakeVerifier = { type: 'recaptcha', verify: async () => 'fake', _reset() { } };
    const conf = await signInWithPhoneNumber(auth, phone, fakeVerifier);
    const r = await fetch('http://127.0.0.1:9190/emulator/v1/projects/demo-kisanbazaar/verificationCodes').then((x) => x.json());
    const code = r.verificationCodes.filter((c) => c.phoneNumber === phone).pop().code;
    await conf.confirm(code);
    return phone;
};
window.__signOut = () => signOut(auth);

export { db, auth, messaging };
