import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";
import { dropDown, generateAddRemoveButtons } from "./nav.js";

const order = new URLSearchParams(window.location.search).get('order') || 'Default';
const all = new URLSearchParams(window.location.search).get('all');

if(window.location.pathname.includes("deck_view")){
    document.querySelector('#orderText').textContent = order;
    document.querySelector('#searchbar').addEventListener('keyup', search); 
    dropDown();

    if (all) { 
        generateAddRemoveButtons(); 
    }
  
}

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

try{
    const urlParams = new URLSearchParams(window.location.search);
    const duelistName = urlParams.get('duelist');
    const all = urlParams.get('all');   

    if (duelistName) {
        document.querySelector('#deck-name').textContent = duelistName.replace(/[^\w\s]/gi, '')
        displayDeckAndOwnedCards(duelistName);
        completionPercentage(duelistName);
        document.title = "Deck View - " + duelistName;

    }else{

        document.querySelector('#deck-name').textContent = "All Cards";
        getAllCardsInDecks().then(
            displayDeckAndOwnedCards("All")
        );
        completionPercentage("All");    
        document.title = "All Needed Cards";
    }

    countCards().then((totalCards) => {
        document.getElementById('totalCards').textContent = totalCards;
    }
    );
    
}catch(error){
   
}

function createHref(card_name){
    let cardName = card_name.trim(); // Remove leading and trailing spaces
    if (cardName.includes(" - ")) {
        cardName = cardName.replace(/(\b\w+)\s*([-–—]?)\s*(\b\w+)/, '$1$2$3');
    }
    cardName = cardName.replace(/\s/g, '-'); // Replace spaces with hyphens
    cardName = cardName.replace(/[.,\/#!$%\^&\*;:{}=\_'`~()]/g,""); // Remove punctuation

    return `https://www.cardmarket.com/it/YuGiOh/Cards/${cardName}?language=5&minCondition=2`;
}

async function generateCards(cards, ownedCards) {
    const deckContainer = document.getElementById('deck-container');
    deckContainer.innerHTML = ''; 
    deckContainer.classList.remove('h-1/2','place-items-center', 'h-full');
    deckContainer.classList.add('grid-cols-6', 'md:grid-cols-10', 'gap-2', 'mt-3');

    cards.forEach(async card => {
        const cardLink = document.createElement('a');
        cardLink.classList.add('relative');

        cardLink.href = createHref(card.name);
        cardLink.target = "_blank";
        const imgPath = `https://firebasestorage.googleapis.com/v0/b/yu-gi-oh--card-manager.appspot.com/o/small_cards%2F${card.id}.jpg?alt=media&token=5312ec3d-15e8-4a78-9f5b-c4572d60e556`;
        const imgPathBig = `https://firebasestorage.googleapis.com/v0/b/yu-gi-oh--card-manager.appspot.com/o/cards%2F${card.id}.jpg?alt=media&token=5312ec3d-15e8-4a78-9f5b-c4572d60e556`;
        const cardImg = document.createElement('img');
        cardImg.src = imgPath;
        cardImg.alt = card.id + "_id";
        cardImg.classList.add('card','static');

        const owned = ownedCards[card.id] || 0;
        const required = card.quantity;
        const ownedLabel = document.createElement('div');
        ownedLabel.classList.add('owned-label','absolute', 'bottom-0','right-0','bg-blue-800','text-white','px-1','py-0.5','rounded-tl-md','text-sm');
        ownedLabel.textContent = `${owned}/${required}`;
        
        const isOwned = ownedCards[card.id] !== undefined && ownedCards[card.id] >= card.quantity;

        cardImg.classList.toggle('grayscale', !isOwned);

        cardLink.appendChild(cardImg);
        cardLink.appendChild(ownedLabel);
        deckContainer.appendChild(cardLink);

        cardImg.addEventListener('mouseover', async () => {
            const highlightImg = document.getElementById('highlight');
            highlightImg.src = imgPathBig;
            setOwned(ownedCards[card.id] || 0, card.quantity);

            try {
                await loadImage(imgPathBig, highlightImg);
            } catch (error) {
                console.error("Errore durante il caricamento dell'immagine grande:", error);
            }
        });

        try {
            await loadImage(imgPath, cardImg);
        } catch (error) {
            console.error("Errore durante il caricamento dell'immagine normale:", error);
        }
    });
}

function loadImage(imgPath, imgElement) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imgPath;
        img.onload = () => {
            imgElement.src = imgPath;
            resolve();
        };
        img.onerror = reject;
    });
}

async function getOwnedCards() {
    try {
        const ownedRef = ref(db, `owned`);
        const ownedSnapshot = await get(ownedRef);

        if (ownedSnapshot.exists()) {
            return ownedSnapshot.val();
        } else {
            console.log("Nessuna carta posseduta.");
            return {};
        }
    } catch (error) {
        console.error("Errore durante il recupero delle carte possedute:", error);
        return {};
    }
}

async function getDeck(duelistName) {
    try {
        const deckRef = ref(db, `decks/${duelistName}`);
        const snapshot = await get(deckRef);

        if (snapshot.exists()) {
            const deckData = snapshot.val();
            const cards = Object.values(deckData);

            let sortedCards = orderBy(cards, order);

            return sortedCards;
        } else {
            console.log("Il deck non esiste:", duelistName);
            return [];
        }
    } catch (error) {
        console.error("Errore durante il recupero del deck:", error);
        return [];
    }
}

async function displayDeckAndOwnedCards(duelistName) {
    let deck, ownedCards;

    try {
     
        if (duelistName !== "All") {
            [deck, ownedCards] = await Promise.all([getDeck(duelistName), getOwnedCards()]);
        } else {
            [deck, ownedCards] = await Promise.all([getAllCardsInDecks(), getOwnedCards()]);
        }
        generateCards(deck, ownedCards);
        


    } catch (error) {
        console.error("Errore durante la visualizzazione del deck e delle carte possedute:", error);
    }
}

async function completionPercentage(duelistName) {
    let deck, ownedCards;

    try {
        if (duelistName !== "All") {
            [deck, ownedCards] = await Promise.all([getDeck(duelistName), getOwnedCards()]);
        } else {
            [deck, ownedCards] = await Promise.all([getAllCardsInDecks(), getOwnedCards()]);
        }

        const totalCards = deck.length;
        const ownedCardsCount = deck.filter(card => ownedCards[card.id] !== undefined && ownedCards[card.id] >= card.quantity).length;
        const percentage = ownedCardsCount / totalCards * 100;

        try {
            document.getElementById('completion-percentage').textContent = `${percentage.toFixed(2)}%`;
            const color = getColorFromPercentage(percentage);
            document.getElementById('percentage-container').style.background = "linear-gradient(to right, " + color + " " + percentage + "%, #ffffff " + percentage + "%)";

        } catch (error) {
            //console.error("Tutto ok, stavo tentando di scrivere il completamento in un posto sbagliato.");
        } finally {
            return percentage.toFixed(2);
        }

    } catch (error) {
        console.error("Errore durante il calcolo del completamento:", error);
    }
}

async function setOwned(owend_quanty, required_quantity){
    const owned_element = document.querySelector('#owned');
    owned_element.innerHTML = owend_quanty;

    const required_element = document.querySelector('#required');
    required_element.innerHTML = required_quantity;

}

async function getAllDecks(){
    try {
        const decksRef = ref(db, `decks`);
        const snapshot = await get(decksRef);
        if (snapshot.exists()) {
            const decks = snapshot.val();
            return decks;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Errore durante il recupero del deck:", error);
        return [];
    }
}

async function getAllCardsInDecks(){
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
        
        let sortedCards = orderBy(cards, order);

        return sortedCards;
    } catch (error) {
        console.error("Errore durante il recupero del deck:", error);
        return [];
    }
}

async function orderBy(cards, orderBy){
    let sortedCards = [];
    let ownedCards = await getOwnedCards();

    switch(orderBy){
        case "Default":
            sortedCards = Object.values(cards).sort((a, b) => {
                if (a.frameType !== b.frameType) {
                return a.frameType.localeCompare(b.frameType);
                } else if (a.level !== b.level) {
                return b.level - a.level;
                } else if (a.frameType === "spell" || a.frameType === "trap") {
                if (a.race !== b.race) {
                    return a.race.localeCompare(b.race);
                }
                }
                return a.name.localeCompare(b.name);
            });
        break;

        case "Owned First":
            sortedCards = Object.values(cards).sort((a, b) => {
                const aOwned = ownedCards[a.id] || 0;
                const bOwned = ownedCards[b.id] || 0;
                if (a.quantity === b.quantity) {
                    return a.name.localeCompare(b.name);
                } else {
                    return bOwned - aOwned;
                }
            });
        break;

        case "Needed First":
            // Order by the quantity of cards required, with higher quantities first
            sortedCards = Object.values(cards).sort((a, b) => {
            if (a.quantity === b.quantity) {
                return a.name.localeCompare(b.name);
            } else {
                return b.quantity - a.quantity;
            }
            });
        break;
            
        case "Frame Type":
            sortedCards = Object.values(cards).sort((a, b) => {
            const aOwned = ownedCards[a.id] || 0;
            const bOwned = ownedCards[b.id] || 0;
            if (a.frameType !== b.frameType) {
                return a.frameType.localeCompare(b.frameType);
            } else if (a.name !== b.name) {
                return a.name.localeCompare(b.name);
            } else {
                return a.quantity - aOwned - (b.quantity - bOwned);
            }
            });
        break;

        case "Name":
            sortedCards = Object.values(cards).sort((a, b) => {
                return a.name.localeCompare(b.name);
            });   
        break;

        case "Archetype":
            //note some cards don't have one: put them last in order by name.
            sortedCards = Object.values(cards).sort((a, b) => {
                if(a.archetype && b.archetype){
                    if (a.archetype !== b.archetype) {
                        return a.archetype.localeCompare(b.archetype);
                    } else {
                        return a.name.localeCompare(b.name);
                    }
                }else if(a.archetype){
                    return -1;
                }else if(b.archetype){
                    return 1;
                }else{
                    return a.name.localeCompare(b.name);
                }
            });
        
    }

    return sortedCards;
}

async function search(){
    //search inside current deck or all decks if all is selected
    const search = document.querySelector('#searchbar').value;

    const all = new URLSearchParams(window.location.search).get('all');
    let deck = [];
    if(all){
        deck = await getAllCardsInDecks();

    }else{
        deck = await getDeck(document.querySelector('#deck-name').textContent);
    }
    const ownedCards = await getOwnedCards();
    const sortedCards = await orderBy(deck, order);
    const filteredCards = sortedCards.filter(card => card.name.toLowerCase().includes(search.toLowerCase()));
    const sortedFilteredCards = await orderBy(filteredCards, order); // Sort filtered cards using the orderBy function

    generateCards(sortedFilteredCards, ownedCards);

}

async function countCards(){
    const all = new URLSearchParams(window.location.search).get('all');
    let deck = [];
    if(all){
        deck = await getAllCardsInDecks();
    }else{
        deck = await getDeck(document.querySelector('#deck-name').textContent);
    }
        //conta le carte totali nel deck utilizzando il campo quantity
    const totalCards = deck.reduce((acc, card) => acc + card.quantity, 0);
    console.log("Total cards: ", totalCards);

    return totalCards;

}

function getColorFromPercentage(percentage) {
    if (percentage < 25) {
        return "#ff6347"; // Rosso
    } else if (percentage < 50) {
        return "#ffa500"; // Arancione
    } else if (percentage < 75) {
        return "#ffd700"; // Giallo
    } else {
        return "#32cd32"; // Verde
    }
}

async function updateList() {

    getAllCardsInDecks().then(
        displayDeckAndOwnedCards("All"),
        console.log("All cards displayed.")
    );
    completionPercentage("All");
    
}
  


// function addCardToOwned(card_id,quantity){
//     const ownedRef = ref(db, `owned/${card_id}`);
//     get(ownedRef).then((snapshot) => {
//         if (snapshot.exists()) {
//             const owned = snapshot.val();
//             set(ownedRef, owned + quantity);
//         } else {
//             set(ownedRef, quantity);
//         }
//     });
// }

// function removeCardFromOwned(card_id,quantity){
//     const ownedRef = ref(db, `owned/${card_id}`);
//     get(ownedRef).then((snapshot) => {
//         if (snapshot.exists()) {
//             const owned = snapshot.val();
//             if(owned - quantity > 0){
//                 set(ownedRef, owned - quantity);
//             }else{
//                 remove(ownedRef);
//             }
//         }
//     });
// }

// async function getCard(id){
//     const cardRef = ref(db, `cards/${id}`);
//     const cardSnapshot = await get(cardRef);
//     if (cardSnapshot.exists()) {
//         return cardSnapshot.val();
//     }
//     return null;
// }





export{completionPercentage, updateList};