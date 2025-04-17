import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth"
import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    Timestamp,
} from "firebase/firestore"
import { auth, db } from "../../../../firebaseConfig.js"

export const registerUser = async (name, email, password, phone) => {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
    )
    const user = userCredential.user

    const userDocRef = doc(db, "users", user.uid)
    const userData = {
        name,
        email,
        phone: phone || "",
        role: "client",
        createdAt: serverTimestamp(),
    }

    await setDoc(userDocRef, userData)

    // --- TODO: Default Stylist Profile Creation (Deferred) ---
    // If we were creating a stylist directly, the logic would go here:
    // if (userData.role === 'stylist') {
    //     const stylistProfileRef = doc(db, "stylist_profiles", user.uid);
    //     await setDoc(stylistProfileRef, {
    //         userId: user.uid,
    //         timeZone: "America/Mexico_City", // Default
    //         bufferTime: 0, // Default
    //         workingHours: { // Default schedule
    //             monday: ["09:00-17:00"], tuesday: ["09:00-17:00"], wednesday: ["09:00-17:00"],
    //             thursday: ["09:00-17:00"], friday: ["09:00-17:00"], saturday: null, sunday: null
    //         },
    //         availabilityOverrides: {},
    //         createdAt: serverTimestamp() // Also track when profile created
    //     });
    // }
    // --- End Deferred Logic ---

    const newUserDoc = await getDoc(userDocRef)
    if (!newUserDoc.exists()) {
        console.warn(
            "User document not immediately available after creation, returning partial data.",
        )
        return {
            uid: user.uid,
            email: user.email,
            ...userData,
            createdAt: Timestamp.now(),
        }
    }

    return {
        uid: user.uid,
        ...newUserDoc.data(),
    }
}

export const loginUser = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password)
    const user = auth.currentUser
    if (!user) {
        throw new Error(
            "Login successful but user object not available immediately",
        )
    }
    const userDocRef = doc(db, "users", user.uid)
    const userDocSnap = await getDoc(userDocRef)
    if (!userDocSnap.exists()) {
        await signOut(auth)
        throw new Error("User data not found")
    }
    const userData = userDocSnap.data()
    return { user: { uid: user.uid, email: user.email, ...userData } }
}

export const logoutUser = () => signOut(auth)

export const getUserData = async (user) => {
    if (!user) return null
    const userDocRef = doc(db, "users", user.uid)
    const userDocSnap = await getDoc(userDocRef)
    if (!userDocSnap.exists()) {
        return null
    }
    return { uid: user.uid, email: user.email, ...userDocSnap.data() }
}

// TODO: Potential function needed later for assigning stylist role + creating profile
// export const assignStylistRole = async (userId) => {
//     const userDocRef = doc(db, "users", userId);
//     const stylistProfileRef = doc(db, "stylist_profiles", userId);
//     // Use a transaction or batch write for atomicity
//     const batch = writeBatch(db);
//     batch.update(userDocRef, { role: "stylist" });
//     batch.set(stylistProfileRef, { /* ... default stylist profile data ... */ });
//     await batch.commit();
// }
