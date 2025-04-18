import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth"
import {
    doc,
    getDoc,
    serverTimestamp,
    Timestamp,
    updateDoc,
    writeBatch,
} from "firebase/firestore"
import { auth, db } from "../../../../firebaseConfig.js"

const defaultWorkingHours = {
    monday: ["09:00-13:00", "14:00-18:00"],
    tuesday: ["09:00-13:00", "14:00-18:00"],
    wednesday: ["09:00-13:00", "14:00-18:00"],
    thursday: ["09:00-13:00", "14:00-17:00"],
    friday: ["10:00-14:00"],
    saturday: null,
    sunday: null,
}

export const registerUser = async (name, email, password, phone, isStylist) => {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
    )
    const user = userCredential.user
    const userId = user.uid

    const userDocRef = doc(db, "users", userId)
    const userData = {
        name,
        email,
        phone: phone || "",
        role: isStylist ? "stylist" : "client",
        createdAt: serverTimestamp(),
    }

    const batch = writeBatch(db)

    batch.set(userDocRef, userData)

    if (isStylist) {
        const stylistProfileRef = doc(db, "stylist_profiles", userId)
        const stylistProfileData = {
            userId: userId,
            timeZone: "America/Mexico_City", // Default timezone (TODO: adjust if needed)
            workingHours: defaultWorkingHours,
            availabilityOverrides: {},
            bufferTime: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }
        batch.set(stylistProfileRef, stylistProfileData)
    }

    await batch.commit()

    try {
        const newUserDoc = await getDoc(userDocRef)
        if (!newUserDoc.exists()) {
            console.warn(
                "User document not immediately available after creation, returning partial data.",
            )
            return {
                uid: userId,
                email: user.email,
                ...userData,
                createdAt: Timestamp.now(),
            }
        }
        return {
            uid: userId,
            email: user.email,
            ...newUserDoc.data(),
        }
    } catch (getDocError) {
        console.error(
            "Error fetching user document immediately after creation:",
            getDocError,
        )
        // Return partial data as fallback
        return {
            uid: userId,
            email: user.email,
            ...userData,
            createdAt: Timestamp.now(),
        }
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
        throw new Error("User data not found. Please contact support.")
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
        console.warn(
            `User document not found for authenticated user UID: ${user.uid}`,
        )
        return null
    }
    return { uid: user.uid, email: user.email, ...userDocSnap.data() }
}

/**
 * Updates specific fields in a user's profile document in Firestore.
 * @param {string} userId - The UID of the user to update.
 * @param {object} dataToUpdate - An object containing the fields to update (e.g., { name, phone }).
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 * @throws {Error} Throws an error if the Firestore operation fails.
 */
export const updateUserProfile = async (userId, dataToUpdate) => {
    if (!userId || !dataToUpdate || Object.keys(dataToUpdate).length === 0) {
        throw new Error("User ID and data to update are required.")
    }

    const userDocRef = doc(db, "users", userId)

    try {
        const updatePayload = {
            ...dataToUpdate,
            updatedAt: serverTimestamp(),
        }

        await updateDoc(userDocRef, updatePayload)
        console.log(`User profile updated for user ${userId}:`, updatePayload)
    } catch (error) {
        console.error(`Error updating user profile for ${userId}:`, error)
        throw new Error("Error al actualizar el perfil. Inténtalo de nuevo.")
    }
}
