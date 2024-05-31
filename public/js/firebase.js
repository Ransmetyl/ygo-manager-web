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

async function getAllDecks(){
    //returns a promise with all the cards in every deck in the database
    return new Promise((resolve, reject) => {
        get(child(ref(db), `decks`)).then((snapshot) => {
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

function getAllDeckCards() {
    return new Promise(async (resolve, reject) => {
        try {
            const decks = await getAllDecks();
            let cards = {};
            for (const deck in decks) {
                const deckCards = Object.values(decks[deck]);
                deckCards.forEach(card => {
                    if (cards[card.id]) {
                        cards[card.id].quantity += card.quantity;
                    } else {
                        cards[card.id] = { ...card };
                    }
                });
            }
            
            const sortedCards = defaulSort(Object.values(cards));

            resolve(sortedCards);
        } catch (error) {
            console.error("Errore durante il recupero del deck:", error);
            //manda un alert con l'errore
            alert("Errore durante il recupero del deck: ",error);
          
            reject([]);
        }
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

async function searchInOwned(card_name){
    //returns a promise with all the cards in the owned list that have the name card_name
    const owned_assoc = await getOwnedIds();
    const ids = Object.keys(owned_assoc);
    let cards = [];
    const cardPromises = ids.map(async (id) => {
        const card = await getCard(id);
        card["quantity"] = owned_assoc[id];
        return card;
    });
    cards = await Promise.all(cardPromises);
    cards = cards.filter(card => card.name.toLowerCase().includes(card_name.toLowerCase()));
    return defaulSort(cards);
}

async function searchInAllDecks(card_name,sort="default"){
    //returns a promise with all the cards in the owned list that have the name card_name
    const decks = await getAllDecks();
    let cards = [];
    for (const deck in decks) {
        const deckCards = Object.values(decks[deck]);
        deckCards.forEach(card => {
            if (card.name.toLowerCase().includes(card_name.toLowerCase())) {
                cards.push(card);
            }
        });
    }
    let sorted = ["No Cards."];

    switch(sort){
        default:
            sorted = defaulSort(cards);
            break;
            
        case "name":
            sorted = sortByName(cards);
            break;

        case "type":
            sorted = sortByRace(cards);
            break;
        
        case "quantityAsc":
            break;

        case "quantityDesc":
            break;
    }

    return sorted;

    
}

async function getOtherData(card_id){
    let data = [];
    return new Promise((resolve, reject) => {
        get(child(ref(db), `cards/${card_id}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const card = snapshot.val();
                //remove the word "Card" from the type
                let type = card.type.split(" ");
                
                if (type[1] == "Card") {
                    type[1] = "";
                } else {
                    type[1] = type[1] + "/";
                }

                
                data.push("["+type[1]+type[0]);
                data.push(card.race+"]");    
            }               
            resolve(data);
        
        }).catch((error) => {
            console.error("Errore durante la ricerca della carta:", error);
            reject(error);
        });
    });
}


export {
    getCard, 
    getOwnedCards, 
    getDeckCards, 
    getCompletionPercentage,
    countDeckCards, 
    getOwnedQuantity,
    countOwnedCards, 
    getAllDeckCards, 
    searchInOwned,
    searchInAllDecks,
    getOtherData,
};
