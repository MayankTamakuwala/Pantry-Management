// utils/auth.ts
import { auth, provider, signInWithPopup } from "./firebase";

export const signInWithGoogle = async () => {
	try {
		const result = await signInWithPopup(auth, provider);
		const user = result.user;
		console.log("User Info: ", user);
		// Redirect or perform additional actions
	} catch (error) {
		console.error("Error during sign in: ", error);
	}
};
