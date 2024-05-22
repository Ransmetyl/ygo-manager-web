
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";
import { dropDown, generateAddRemoveButtons } from "./nav.js";

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
const order = new URLSearchParams(window.location.search).get('order') || 'Default';

dropDown();
generateAddRemoveButtons();

document.title = "Collection";

getAllOwnedCards().then((ownedCards) => {
    console.log(ownedCards.length);

    Promise.all([
        countTotalOwnedCards(ownedCards),
        orderBy(ownedCards, order)
    ]).then(([total, sortedOwnedCards]) => {
        console.log(total);
        document.getElementById('totalCards').textContent = total;
        generateOwned(sortedOwnedCards);
        console.log("Carte possedute generate correttamente!");
    });
});

async function getOwnedCards() {
    const ownedCardsRef = ref(db, 'owned');
    const snapshot = await get(ownedCardsRef);
    return snapshot.val();
}

async function getCard(id) {
    const cardRef = ref(db, `cards/${id}`);
    const snapshot = await get(cardRef);
    return snapshot.val();
}

async function getAllOwnedCards(){
    const ownedCards = await getOwnedCards();
    let ids = Object.keys(ownedCards);
    let cardData = [];

    await Promise.all(ids.map(async (id) => {
        const card = await getCard(id);
        card.quantity = ownedCards[id]; // Add the quantity attribute to cardData
        cardData.push(card);
    }));

    return cardData;
}

async function countTotalOwnedCards(ownedCards) {
    let total = 0;
    ownedCards.forEach(card => {
        total += card.quantity;
    });
    return total;
}

async function generateOwned(ownedCards) {
    try {
        const deckContainer = document.getElementById('owned-container');
        deckContainer.innerHTML = '';
        deckContainer.classList.remove('h-1/2', 'place-items-center', 'h-full');
        deckContainer.classList.add('grid-cols-6', 'md:grid-cols-10', 'gap-2', 'mt-3');

        await new Promise(() => {
            ownedCards.forEach(async (card) => {
                //console.log("I'm working on id: ", card.id);

                const imgPath = `https://firebasestorage.googleapis.com/v0/b/yu-gi-oh--card-manager.appspot.com/o/small_cards%2F${card.id}.jpg?alt=media&token=5312ec3d-15e8-4a78-9f5b-c4572d60e556`;
                const imgPathBig = `https://firebasestorage.googleapis.com/v0/b/yu-gi-oh--card-manager.appspot.com/o/cards%2F${card.id}.jpg?alt=media&token=5312ec3d-15e8-4a78-9f5b-c4572d60e556`;

                const cardLink = document.createElement('a');
                cardLink.classList.add('relative');
                cardLink.href = createHref(card.name);
                cardLink.target = "_blank";

                const cardImg = document.createElement('img');
                cardImg.src = imgPath;
                cardImg.alt = card.id + "_id";
                cardImg.classList.add('card', 'static');

                const owned = card.quantity || 0;
                const ownedLabel = document.createElement('div');
                ownedLabel.classList.add('owned-label', 'absolute', 'bottom-0', 'right-0', 'bg-blue-800', 'text-white', 'px-1', 'py-0.5', 'rounded-tl-md', 'text-sm');
                ownedLabel.textContent = `${owned}`;

                cardLink.appendChild(cardImg);
                cardLink.appendChild(ownedLabel);
                document.getElementById('owned-container').appendChild(cardLink);

                cardImg.addEventListener('mouseover', async () => {
                    const highlightImg = document.getElementById('highlight');
                    highlightImg.src = imgPathBig;
                    const owned = document.getElementById('owned');
                    owned.textContent = `${card.quantity || 0}`;
        
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
        
        );
    } catch (error) {
        console.error("Errore durante la generazione delle carte possedute:", error);
    }
}
        
function createHref(cardName) {
    return `https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=2&cid=${cardName}`;
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
async function search(){
    //search inside collection
    const search = document.querySelector('#searchbar').value;

    const ownedCards = await getAllOwnedCards();
    const filteredCards = ownedCards.filter(card => card.name.toLowerCase().includes(search.toLowerCase()));
    const sortedFilteredCards = await orderBy(filteredCards, order); // Sort filtered cards using the orderBy function

    generateOwned(sortedFilteredCards);
}



async function orderBy(cards, orderBy) {
    let sortedCards = [];
    let ownedCards = await getOwnedCards();

    switch (orderBy) {
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
            sortedCards = Object.values(cards).sort((a, b) => {
                if (a.archetype && b.archetype) {
                    if (a.archetype !== b.archetype) {
                        return a.archetype.localeCompare(b.archetype);
                    } else {
                        return a.name.localeCompare(b.name);
                    }
                } else if (a.archetype) {
                    return -1;
                } else if (b.archetype) {
                    return 1;
                } else {
                    return a.name.localeCompare(b.name);
                }
            });
            break;
    }

    return sortedCards;
}
