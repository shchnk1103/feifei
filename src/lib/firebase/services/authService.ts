import { auth, db } from "../config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export interface UserData {
  uid: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  createdAt: Date;
}

export const authService = {
  // 注册新用户
  async register(email: string, password: string): Promise<UserData> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredential;

    // 创建用户档案，过滤掉 undefined 值
    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      createdAt: new Date(),
      ...(user.displayName ? { displayName: user.displayName } : {}),
      ...(user.photoURL ? { photoURL: user.photoURL } : {}),
    };

    // 存储用户数据到 Firestore
    await setDoc(doc(db, "users", user.uid), userData);

    return userData;
  },

  // 用户登录
  async login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  },

  // 用户登出
  async logout() {
    return signOut(auth);
  },

  // 监听用户状态
  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },
};
