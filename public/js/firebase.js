import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getDatabase, ref, get, child, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBk6juZfAGVeR_VVkgOtxYaNxKlkSkBrng",
  authDomain: "yu-gi-oh--card-manager.firebaseapp.com",
  databaseURL: "https://yu-gi-oh--card-manager-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "yu-gi-oh--card-manager",
  storageBucket: "yu-gi-oh--card-manager.appspot.com",
  messagingSenderId: "738224563817",
  appId: "1:738224563817:web:98db113a1f7a8cc9ba24f8",
  measurementId: "G-4134ZNWTVK"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export {firebaseConfig,app,db};


