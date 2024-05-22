import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";

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

document.addEventListener('DOMContentLoaded', () => {
    
    let adding = false;
    
    const addBtn = document.querySelector('#addBtn');
    const annulla = document.querySelector('#dontBtn');
    const search = document.querySelector('#searchCard');
    const modal = document.getElementById('modal');
    
    const addCard = document.querySelector('#add');
    const remCard = document.querySelector('#remove');

    addCard.addEventListener('click', () => {
        modal.classList.remove('hidden');
        console.log('Adding cards');
        adding = true;
        modal.querySelector('#modal-title').textContent = 'Adding';
        addBtn.textContent = 'Add';
    });

    remCard.addEventListener('click', () => {
        modal.classList.remove('hidden');
        console.log('Removing cards');
        modal.querySelector('#modal-title').textContent = 'Removing';
        addBtn.textContent = 'Remove';
    });

    addBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        if(adding){
            addCards().then(() => {
                updateList().then(() => {
                    console.log('Cards added');
                });
            });
        }else{
            removeCards().then(() => {
                updateList().then(() => {
                    console.log('Cards removed');
                });
            });
        }
        resetModalResults();
       
        
    });

    annulla.addEventListener('click', () => {
        modal.classList.add('hidden');
        resetModalResults();
    });

    search.addEventListener('keyup', () => {
        if(event.keyCode === 13){
            console.log('Enter pressed');
            const results = document.querySelector('#search-results');
            results.innerHTML = roller();
    
            searchCardByName(search.value).then(searchedCards => {
                results.innerHTML = '';
                results.classList.add('grid', 'grid-cols-4');
                if(searchedCards.length === 0){
                    emptyModalResults();
                }else{
                    searchedCards.forEach(card => {
                        results.appendChild(card);
                    });
                }
            });
        }
    
    });
    

});

async function generateSearchedCard(id){
    const searchedCard = document.createElement('div');
    searchedCard.className = 'relative searched-card';
    searchedCard.id = id;

    const img = document.createElement('img');
    const imgPath = `https://firebasestorage.googleapis.com/v0/b/yu-gi-oh--card-manager.appspot.com/o/small_cards%2F${id}.jpg?alt=media&token=5312ec3d-15e8-4a78-9f5b-c4572d60e556`;
    img.src = imgPath;
    img.alt = 'Card';
    img.className = 'mx-auto mt-3 w-4/5 cursor-pointer';

    img.addEventListener('click', () => {
        img.classList.toggle('selected');
        img.classList.toggle('border-4');
        img.classList.toggle('border-blue-500');
    });
    
    searchedCard.appendChild(img);
    return searchedCard;
}
async function searchCardByName(name){
    const cardsRef = ref(db, 'cards');
    const cardsSnapshot = await get(cardsRef);
    const cards = cardsSnapshot.val();
    const searchedCards = [];

    for(const card in cards){
        if(cards[card].name.toLowerCase().includes(name.toLowerCase())){
            const searchedCard = await generateSearchedCard(card);
            searchedCards.push(searchedCard);
        }
    }
    searchedCards.sort((a, b) => {
        const frameTypeA = cards[a.id].frameType;
        const frameTypeB = cards[b.id].frameType;
        const levelA = cards[a.id].level;
        const levelB = cards[b.id].level;
        if (frameTypeA < frameTypeB) {
            return -1;
        }
        if (frameTypeA > frameTypeB) {
            return 1;
        }
        if (levelA > levelB) { // Modified line
            return -1; // Modified line
        }
        if (levelA < levelB) { // Modified line
            return 1; // Modified line
        }
        return 0;
    });
    return searchedCards;
}

function resetModalResults(){
    const results = document.querySelector('#search-results');
    results.innerHTML = `
        <span>
            <p class="text-gray-700 text-2xl">Search for a card...</p>
        </span>
    `;
    results.classList.remove('grid', 'grid-cols-4');

    const search = document.querySelector('#searchCard');
    search.value = '';

    const quantity = document.querySelector('#card-quantity');
    quantity.value = 1;

    const selectedCards = document.querySelectorAll('.selected');
    selectedCards.forEach(card => {
        card.classList.remove('selected');
        card.classList.remove('border-4');
        card.classList.remove('border-blue-500');
    });

    console.log('Modal reset'); 

}

function emptyModalResults(){

    const results = document.querySelector('#search-results');
    results.innerHTML = `
        <span>
            <p class="text-gray-700 text-2xl">No cards found...</p>
        </span>
    `;
    results.classList.remove('grid', 'grid-cols-4');
    console.log('No cards found');
}


async function addCards(){
    const addQuantity = document.querySelector('#card-quantity').value;
    const selectedCards = document.querySelectorAll('.selected');
    const cardIds = [];
    selectedCards.forEach(card => {
        cardIds.push(card.parentElement.id);
    });
    cardIds.forEach(card => {
        // Add the card to the owned cards in the database with the quantity
        const cardRef = ref(db, `owned/${card}`);
        get(cardRef).then((snapshot) => {
            const currentQuantity = snapshot.val() || 0;
            const newQuantity = currentQuantity + parseInt(addQuantity);
            set(cardRef, newQuantity);
            console.log(`Added ${addQuantity} of card ${card}`);
        });
    });
}

async function removeCards(){
    const remQuantity = document.querySelector('#card-quantity').value;
    const selectedCards = document.querySelectorAll('.selected');
    const cardIds = [];
    selectedCards.forEach(card => {
        cardIds.push(card.parentElement.id);
    });
    cardIds.forEach(card => {
        // Remove the card from the owned cards in the database with the quantity
        const cardRef = ref(db, `owned/${card}`);
        get(cardRef).then((snapshot) => {
            const currentQuantity = snapshot.val() || 0;
            const newQuantity = currentQuantity - parseInt(remQuantity);
            if(newQuantity <= 0){
                set(cardRef, null);
            } else {
                set(cardRef, newQuantity);
            }
            console.log(`Removed ${remQuantity} of card ${card}`);
        });
    });
}

function roller(){
    return `
        <div role="status" class="flex justify-center items-center">
            <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentFill"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
            </svg>
            <span class="sr-only">Loading...</span>
        </div>`
}





//26746975