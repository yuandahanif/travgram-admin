import {
  FIRESTORE_ENTITY,
  useCollection,
  useDocument,
  useFQuery,
} from "./utils/useFirestore";

import { f_pengguna, f_user_upload } from "../types/firestore";
import {
  DocumentReference,
  DocumentSnapshot,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import app from "./configs/firebase";

export const db = getFirestore(app);

function App() {
  const useruploads = useFQuery<f_user_upload>(
    FIRESTORE_ENTITY["user-upload"].key,
    [],
    { fieldPath: "waktu_unggah", directionStr: "desc" }
  );

  const updateUserPoint = async (userId: string) => {
    try {
      const docRef = doc(
        db,
        FIRESTORE_ENTITY.pengguna.key,
        userId
      ) as DocumentReference<f_pengguna>;

      const pengguna = await getDoc(docRef);
      const point = pengguna.data()?.total_poin;
      const new_poin = point != undefined ? point + 10 : 10;

      setDoc(doc(db, FIRESTORE_ENTITY["pengguna"].key, pengguna.id), {
        ...pengguna.data(),
        total_poin: new_poin,
      });

      alert("berhasil");
    } catch (error) {
      console.log("file: App.tsx:47 ~ updateUserPoint ~ error", error);
      alert("gagal");
    }
  };

  const onAction = (id: string, accept: boolean, rest: f_user_upload) => {
    setDoc(doc(db, FIRESTORE_ENTITY["user-upload"].key, id), {
      ...rest,
      is_accepted: accept,
    })
      .then(async () => {
        updateUserPoint(rest.user_id.id);
      })
      .catch((error) => {
        alert("gagal");
        console.log(error);
      });
  };

  return (
    <div className="bg-slate-400 w-full py-10 flex flex-col items-center justify-center gap-4">
      {useruploads?.docs.map((u) => (
        <div className="w-fit relative" key={u.data().file_id}>
          <img src={u.data().file_url} loading="lazy" className="w-96 h-auto" />

          <div className="text-center bg-white p-2">
            {u.data().is_accepted ? "Sudah Disetujui" : "menunggu persetujuan"}
          </div>

          <div className="bg-white p-2 flex justify-evenly">
            {!u.data().is_accepted && (
              <>
                <button
                  type="button"
                  onClick={() => onAction(u.id, true, u.data())}
                >
                  Terima
                </button>
                <button
                  type="button"
                  onClick={() => onAction(u.id, false, u.data())}
                >
                  Tolak
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
