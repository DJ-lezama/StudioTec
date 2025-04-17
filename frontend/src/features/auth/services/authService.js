import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { auth, db } from "../../../../firebaseConfig.js"

export const registerUser = async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
    )
    const user = userCredential.user

    const userDocRef = doc(db, "users", user.uid)
    await setDoc(userDocRef, {
        name,
        email,
        role: "client",
        createdAt: serverTimestamp(),
    })

    const newUserDoc = await getDoc(userDocRef)

    return {
        uid: user.uid,
        email: user.email,
        ...newUserDoc.data(),
    }
}

export const loginUser = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password)
    const user = auth.currentUser

    if (!user) {
        const error = new Error(
            "Login successful but user object not available immediately",
        )
        error.code = "auth/user-not-available"
        throw error
    }

    const userDocRef = doc(db, "users", user.uid)
    const userDocSnap = await getDoc(userDocRef)

    if (!userDocSnap.exists()) {
        await signOut(auth)
        const error = new Error("User data not found")
        error.code = "auth/user-data-missing"
        throw error
    }

    const userData = userDocSnap.data()
    return {
        user: {
            uid: user.uid,
            email: user.email,
            ...userData,
        },
    }
}

export const logoutUser = () => signOut(auth)

export const getUserData = async (user) => {
    if (!user) return null

    const userDocRef = doc(db, "users", user.uid)
    const userDocSnap = await getDoc(userDocRef)

    if (!userDocSnap.exists()) {
        return null
    }

    return {
        uid: user.uid,
        email: user.email,
        ...userDocSnap.data(),
    }
}
