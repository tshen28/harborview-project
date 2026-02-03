import { sendPasswordResetEmail } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "./firebase";

export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    console.error("Password reset error:", error);
    throw new Error(getErrorMessage(error.code));
  }
};

export const findUsernameByEmail = async (email: string) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("No account found with this email address");
    }

    const userData = querySnapshot.docs[0].data();
    return {
      success: true,
      email: userData.email,
      name: userData.name || "User",
    };
  } catch (error: any) {
    console.error("Username lookup error:", error);
    throw error;
  }
};

const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/user-not-found":
      return "No account found with this email address";
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/too-many-requests":
      return "Too many requests. Please try again later";
    default:
      return "An error occurred. Please try again";
  }
};
