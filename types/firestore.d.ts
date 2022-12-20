import { DocumentReference, Timestamp } from "firebase/firestore";

type f_quest = {
  id?: string;
  deskripsi: string;
  file_urls: string[];
  nama: string;
  poin: number;
  petunjuk: string[];
};

type f_kota__wisata = {
  id?: string;
  deskripsi: string;
  gambar: string[];
  quests?: {
    [key: string]: f_quest;
  };
  rute?: string[];
  nama: string;
};

type f_kota = {
  nama: string;
  gambar: string;
  wisata: {
    [key: string]: f_kota__wisata;
  };
};

type f_pengguna = {
  uid?: string;
  alamat: string;
  nama: string;
  nama_pengguna: string;
  no_hp: string;
  total_poin?: number;
};

type f_user_upload = {
  file_id: string;
  kota_id: DocumentReference<f_kota>;
  like: number;
  file_url: string;
  wisata_id: string;
  quest_id: string;
  user_id: DocumentReference<f_pengguna>;
  waktu_unggah: Timestamp;
  is_accepted: boolean;
};
