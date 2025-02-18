import { Timestamp } from "firebase/firestore";

export const createTimestamp = () => Timestamp.now();

export const formatTimestamp = (timestamp: Timestamp): string => {
  return new Date(timestamp.seconds * 1000).toLocaleDateString();
};

export const withTimestamp = <T extends object>(data: T) => ({
  ...data,
  createdAt: createTimestamp(),
  updatedAt: createTimestamp(),
});

export const updateWithTimestamp = <T extends object>(data: T) => ({
  ...data,
  updatedAt: createTimestamp(),
});
