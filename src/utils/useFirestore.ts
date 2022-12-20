import {
  getFirestore,
  collection,
  QuerySnapshot,
  CollectionReference,
  doc,
  DocumentReference,
  DocumentSnapshot,
  onSnapshot,
  query,
  where,
  FieldPath,
  WhereFilterOp,
  QueryConstraint,
  orderBy,
  OrderByDirection,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import app from "../configs/firebase";

export const FIRESTORE_ENTITY = {
  kota: {
    key: "kota",
  },
  pengguna: {
    key: "pengguna",
  },
  "user-upload": {
    key: "user-upload",
  },
};

const db = getFirestore(app);

export function useDocRef<T>(entity: string, id: string) {
  const docRef = doc(db, entity, id) as DocumentReference<T>;

  return docRef;
}

export function useCollection<T>(entity: string) {
  const cols = collection(db, entity) as CollectionReference<T>;

  const [queryRes, setQueryRes] = useState<QuerySnapshot<T> | undefined>(
    undefined
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      cols,
      (data) => {
        setQueryRes(data);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => unsubscribe();
  }, []);

  return queryRes;
}

export function useDocument<T>(entity: string, id: string) {
  const docRef = doc(db, entity, id) as DocumentReference<T>;

  const [documentRes, setDocumentRes] = useState<
    DocumentSnapshot<T> | undefined
  >(undefined);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      docRef,
      (data) => {
        setDocumentRes(data);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => unsubscribe();
  }, []);

  return documentRes;
}

export function useFQuery<T>(
  entity: string,
  statements: {
    fieldPath: string | FieldPath;
    opStr: WhereFilterOp;
    value: string | DocumentReference | boolean | number;
  }[],
  orderStatement?: {
    fieldPath: string | FieldPath;
    directionStr?: OrderByDirection;
  }
) {
  const wheres: QueryConstraint[] = [];
  const docRef = collection(db, entity) as CollectionReference<T>;
  const [documentRes, setDocumentRes] = useState<QuerySnapshot<T> | undefined>(
    undefined
  );
  if (orderStatement) {
    wheres.push(orderBy(orderStatement.fieldPath, orderStatement.directionStr));
  }

  statements.forEach((s) => {
    wheres.push(where(s.fieldPath, s.opStr, s.value));
  });

  useEffect(() => {
    const q = query(docRef, ...wheres);

    const unsubscribe = onSnapshot(
      q,
      (data) => {
        setDocumentRes(data);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => unsubscribe();
  }, []);

  return documentRes;
}
