import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getDatabase, ref, get, child, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";
import { defaulSort } from "./utils.js";

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

async function getCard(id){
    return new Promise((resolve, reject) => {
        get(child(ref(db), `cards/${id}`)).then((snapshot) => {
            if (snapshot.exists()) {
                resolve(snapshot.val());
            } else {
                console.log("Nessuna carta trovata.");
                reject("Nessuna carta trovata.");
            }
        }).catch((error) => {
            console.error("Errore durante la ricerca della carta:", error);
            reject(error);
        });
    });
}

async function getOwnedIds(){
    return new Promise((resolve, reject) => {
        get(child(ref(db), `owned`)).then((snapshot) => {
            if (snapshot.exists()) {
                resolve(snapshot.val());
            } else {
                console.log("Nessuna carta posseduta.");
                reject("Nessuna carta posseduta.");
            }
        }).catch((error) => {
            console.error("Errore durante la ricerca delle carte possedute:", error);
            reject(error);
        });
    });
}

async function getOwnedCards(){
    const owned_assoc = await getOwnedIds();
    console.log(owned_assoc);
    const ids = Object.keys(owned_assoc);

    let cards = [];
    console.log("Retrieving cards...");
    const cardPromises = ids.map(async (id) => {
        const card = await getCard(id);
        card["quantity"] = owned_assoc[id];
        return card;
    });
    cards = await Promise.all(cardPromises);
    console.log(cards);
    return defaulSort(cards);
}

async function getDeckCards(deck_name){

    return new Promise((resolve, reject) => {
        get(child(ref(db), `decks/${deck_name}`)).then((snapshot) => {
            if (snapshot.exists()) {
                resolve(defaulSort(snapshot.val()));

            } else {
                console.log("Nessuna carta trovata.");
                reject("Nessuna carta trovata.");
            }
        }).catch((error) => {
            console.error("Errore durante la ricerca della carta:", error);
            reject(error);
        });
    });
}

async function countDeckCards(deck_name){
    const deck = await getDeckCards(deck_name);
    let count = 0;
    deck.forEach(array => {
        array.forEach(card => {
            count += card.quantity;
        });
    });
    return count;


}

async function getCompletionPercentage(deck_name) {
    let total = 0;
    let owned = 0;

    try {
        const deck = await getDeckCards(deck_name);
        await Promise.all(
            deck.map(async (array) => {
                await Promise.all(
                    array.map(async (card) => {
                        total += card.quantity;
                        const quantity = await getOwnedQuantity(card.id);
                        owned += card.quantity < quantity ? card.quantity : quantity;
                    })
                );
            })
        );
    } catch (error) {
        console.error("Error calculating completion percentage:", error);
    }

    const completionPercentage = ((owned / total) * 100).toFixed(2);
    return completionPercentage;
}

async function getOwnedQuantity(card_id){
    return new Promise((resolve, reject) => {
        get(child(ref(db), `owned/${card_id}`)).then((snapshot) => {
            if (snapshot.exists()) {
                resolve(snapshot.val());
            } else {
                resolve(0);
            }
        }).catch((error) => {
            console.error("Errore durante la ricerca della quantità della carta:", error);
            reject(error);
        });
    });
}


async function countOwnedCards(){
    const owned_assoc = await getOwnedIds();
    const ids = Object.keys(owned_assoc);
    let count = 0;
    ids.forEach(id => {
        count += owned_assoc[id];
    });
    return count;
}

export {getCard, getOwnedCards, getDeckCards, getCompletionPercentage,countDeckCards, getOwnedQuantity,countOwnedCards};


