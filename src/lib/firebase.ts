import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyDboUF0zZtxJMCroobtJKQzMVlXRtygEPg",
	authDomain: "pantry-tracker-23e0a.firebaseapp.com",
	projectId: "pantry-tracker-23e0a",
	storageBucket: "pantry-tracker-23e0a.appspot.com",
	messagingSenderId: "628881064703",
	appId: "1:628881064703:web:a2973538483c7f1c0282ca",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, signInWithPopup };
