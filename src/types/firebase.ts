import { Timestamp, DocumentData } from "firebase/firestore";

export interface FirebaseTimestamp {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface WithFirebaseTimestamp<T extends DocumentData> {
  id: string;
  data: T;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
