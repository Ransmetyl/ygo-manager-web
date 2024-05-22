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
const dbRef = ref(db);
const cardsRef = child(dbRef, 'cards');


function getCards(cardName) {
    return new Promise((resolve, reject) => {
        let cards = [];
        get(query(cardsRef, orderByChild('name'), equalTo(cardName))).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const card = childSnapshot.val();
                    cards.push(card);
                });
                resolve(cards);
            } else {
                console.log("La carta non è stata trovata nel database.");
                reject("La carta non è stata trovata nel database.");
            }
        }).catch((error) => {
            console.error("Errore durante la ricerca della carta:", error);
            reject(error);
        });
    });
}

async function createCard(cardName) {
    try {
        const cards = await getCards(cardName);
        const container = document.getElementById('card-container');
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            const imgPath = `https://firebasestorage.googleapis.com/v0/b/yu-gi-oh--card-manager.appspot.com/o/cards%2F${card.id}.jpg?alt=media&token=5312ec3d-15e8-4a78-9f5b-c4572d60e556`;
            cardElement.innerHTML = `
                <img src="${imgPath}" alt="${card.name}">
                <div class="card-info">
                    <h3>${card.name}</h3>
                    <p>${card.desc}</p>
                </div>
            `;
            container.appendChild(cardElement);
        });
    } catch (error) {
        console.error("Errore durante la creazione della carta:", error);
    }
}

createCard('Dark Magician');
createCard('Blue-Eyes White Dragon');