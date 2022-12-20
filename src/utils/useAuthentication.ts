import React from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { FIRESTORE_ENTITY } from "./useFirestore";
import {
  doc,
  DocumentReference,
  getDoc,
  getFirestore,
} from "firebase/firestore";
import app from "@config/firebase";

const auth = getAuth(app);
const db = getFirestore(app);

export function useAuthentication() {
  const [user, setUser] = React.useState<User>();
  const [extra, setExtra] = React.useState<f_pengguna>();

  React.useEffect(() => {
    const getUserFirestore = async (id: string) => {
      const docRef = doc(
        db,
        FIRESTORE_ENTITY.pengguna.key,
        id
      ) as DocumentReference<f_pengguna>;
      const one = await getDoc(docRef);
      if (one.exists()) {
        setExtra(one.data());
      }
    };

    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User

        getUserFirestore(user.uid);

        setUser({ ...user, uid: user.uid });
      } else {
        // User is signed out
        setUser(undefined);
      }
    });

    return unsubscribeFromAuthStatuChanged;
  }, []);

  return {
    user,
    extra,
  };
}
