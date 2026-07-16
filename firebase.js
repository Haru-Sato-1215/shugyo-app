// Firebase本体
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

// Firestore
import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// Firebase設定
const firebaseConfig = {
    apiKey: "AIzaSyBijAcHsvyPXnSrpTO-90vQVsj6Dr2MR-o",
    authDomain: "shugyo-app.firebaseapp.com",
    projectId: "shugyo-app",
    storageBucket: "shugyo-app.firebasestorage.app",
    messagingSenderId: "418474502237",
    appId: "1:418474502237:web:fef640dd9b6c5ebb0a45b4"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);

// Firestore取得
const db = getFirestore(app);

// 他のファイルでも使えるようにする
export { db };