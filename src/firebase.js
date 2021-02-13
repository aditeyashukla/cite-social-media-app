import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FB_API_KEY,
    authDomain: "cite-sma.firebaseapp.com",
    projectId: "cite-sma",
    storageBucket: "cite-sma.appspot.com",
    messagingSenderId: process.env.REACT_APP_FB_messagingSenderId,
    appId: process.env.REACT_APP_FB_appId,
    measurementId: process.env.REACT_APP_FB_measurementId
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}else {
    firebase.app(); // if already initialized, use that one
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();


export const generateUserDocument = async (user, additionalData) => {
    if (!user) return;
    const userRef = firestore.doc(`users/${user.uid}`);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
        const { email, displayName } = user;
        try {
            await userRef.set({
                displayName,
                email,
                ...additionalData
            });
        } catch (error) {
            console.error("Error creating user document", error);
        }
    }
    return getUserDocument(user.uid);
};


const getUserDocument = async uid => {
    if (!uid) return null;
    try {
        const userDocument = await firestore.doc(`users/${uid}`).get();

        return {
            uid,
            ...userDocument.data()
        };
    } catch (error) {
        console.error("Error fetching user", error);
    }
};

export const createUserDocument = async (user, additionalData) => {
    if (!user) return;
    const userRef = firestore.doc(`users/${user.uid}`);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
        const { email, displayName } = user;
        try {
            await userRef.set({
                displayName,
                email,
                ...additionalData
            });
        } catch (error) {
            console.error("Error creating user document", error);
        }
    }
};

export default firebase.firestore();