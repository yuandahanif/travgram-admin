import app from "@config/firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage(app);

export const STORAGE_PATHS = {
  userUpload: "/user-uploads/",
};

export function useStorage() {
  const uploadByte = async ({
    child,
    fileName,
    file,
  }: {
    fileName: string;
    child: keyof typeof STORAGE_PATHS;
    file: Blob | Uint8Array | ArrayBuffer;
  }) => {
    try {
      const storageRef = ref(storage, STORAGE_PATHS[child] + fileName);

      return await uploadBytes(storageRef, file).then((snapshot) => {
        return snapshot;
      });
    } catch (error) {
      console.log(error);
      throw new Error("Upload error");
    }
  };

  const getMetadata = (fullPath: string) => {
    const pathReference = ref(storage, fullPath);

    return pathReference;
  };

  const getUrl = async (fullPath: string) => {
    const url = await getDownloadURL(ref(storage, fullPath));

    return url;
  };

  return { uploadByte, getMetadata, getUrl };
}
