import {getCompletionPercentage, getDeckCards, getOwnedQuantity, countDeckCards} from './firebase.js';
import {getColorFromPercentage, getSeriesChars} from './utils.js';


const animeDecks = document.getElementById('anime-decks');
const allDeckCards = document.getElementById('all-deck-cards');
const collection = document.getElementById('collection');
const nav = document.getElementById('nav-content')
const content = document.getElementById('content')
const archetypes = document.getElementById('archetypes');

//if location contains more than 1 ?view=, redirect to the page without parameters
if(window.location.href.split('?view=').length > 2){
    window.location.href = window.location.href.split('?view=')[0];
}

disposeNav();
controller();

function basicNav(title){
    return `<h1 class="text-sm md:text-2xl flex-1 mx-5 ms-10 mb-1" id="title">${title}</h1>
    <div class="flex items center">
        <button id="add" type="button" class="mx-3 inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">Add</button>
        <button id="remove" type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:mt-0 sm:w-auto">Remove</button>
    </div>
    <input type="text" class="w-1/5 p-1.5 mx-3 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-400" placeholder="Search" id="searchbar">
    <div class="relative inline-block text-left me-5">
        <div>
            <button type="button" class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
                <span class="hidden md:inline">Order:</span>
                <span class="text-gray-600" id="orderText">Default</span>
                <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    </div>
    `
}

function animeDecksNav(title){
    return `<h1 class="text-sm md:text-2xl flex-1 mx-5 ms-10 mb-1" id="title">${title}</h1>
    <div class="relative inline-block text-left me-5">
        <div>
            <button type="button" class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
                <span class="hidden md:inline">Series: </span>
                <span class="text-gray-600" id="orderText">Duel Monsters</span>
                <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    </div>
    `
}

function deckViewNav(title, percentage, cardsCount) {

    const html = `<h1 class="text-sm md:text-2xl flex-1 mx-5 ms-10 mb-1" id="title">${title}</h1>
    <input type="text" class="w-1/5 p-1.5 mx-3 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-400" placeholder="Search" id="searchbar">
    <div class="relative inline-block text-left me-1">
        <div>
            <button type="button" class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
                <span class="hidden md:inline">Order:</span>
                <span class="text-gray-600" id="orderText">Default</span>
                <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    </div>
    <div class="flex items-center rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 mx-2 p-1.5">
        <p id="totalCards" class="text-gray-900 font-bold px-1">${cardsCount}</p>
    </div>
    <div class="flex items-center rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 mx-1 p-1.5" id="percentage-container">
        <p id="completion-percentage" class="text-gray-900 font-bold px-1">${percentage}%</p>
    </div>
    `
    
    //html.getElementById('percentage-container').style.background = "linear-gradient(to right, " + getColorFromPercentage(percentage) + " " + percentage + "%, #ffffff " + percentage + "%)";

    return html;

}


function deckNavColors(){
    const percentage = document.getElementById('completion-percentage').textContent.split('%')[0];
    console.log(percentage);
    const percentageContainer = document.getElementById('percentage-container');
    const color = getColorFromPercentage(percentage);

    percentageContainer.style.background = "linear-gradient(to right, " + color + " " + percentage + "%, #ffffff " + percentage + "%)";
    
    console.log(color);
}


function disposeNav(){
    nav.innerHTML = '';
}

function location(){
    return window.location.href.split('?view=')[1];
}

function redirect(where) {
    const get_param = '?view=' + where;
    const currentLocation = location();

    if (currentLocation === undefined) {
        window.location.href += get_param;
    } else if (currentLocation !== where) {
        window.location.href = window.location.href.replace(currentLocation, where);
    }
}

function showContent(){
    document.getElementById('app').classList.remove('hidden');
}

animeDecks.addEventListener('click', () => {
    redirect('animeDecks');
});

allDeckCards.addEventListener('click', () => {
    redirect('allDeckCards');
});

collection.addEventListener('click', () => {
    redirect('collection');
});

archetypes.addEventListener('click', () => {
    redirect('archetypes');
});


function controller(){
    const view = location().split('&')[0];
    switch(view){
        case 'animeDecks':
            nav.innerHTML = animeDecksNav('Anime Decks');
            loadChars('duel-monsters');

            break;
        case 'allDeckCards':
            nav.innerHTML = basicNav('All Deck Cards');
            break;
        case 'collection':
            nav.innerHTML = basicNav('Collection');
            break;
        case 'archetypes':
            nav.innerHTML = basicNav('Archetypes');
            break;

        case 'deck':
            let duelist = new URLSearchParams(window.location.search).get('duelist') || 'Yami Yugi';
            Promise.all([
                getCompletionPercentage(duelist),
                countDeckCards(duelist)
            ]).then(([percentage, cardsCount]) => {
                nav.innerHTML = deckViewNav(duelist, percentage, cardsCount);
                deckNavColors();

                showDeck(duelist);

            });

            break;
        default:
            console.log('default');
            break;   
    }

    showContent();  //Serve per evitare il flickering tra la visualizzazione del contenuto e la rimozione del nav
}

function loader(){
    return `  
    
    <div role="status">
        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentFill"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
        </svg>
        <span class="sr-only">Loading...</span>
    </div>`
}

function resetContent(){
    content.classList.add('grid','h-1/5','place-items-center')
    content.classList.remove('h-screen','overflow-auto')
}

function prepareForDuelists(){
    content.classList.remove('grid','h-1/5','place-items-center')
    content.classList.add('h-screen','overflow-auto')
    content.innerHTML = `<div class="char-container flex flex-wrap justify-center overflow-y-auto mb-32" id="duelists"></div>`
}

function createCharacterCard(name, percentage) {

    const color = getColorFromPercentage(percentage);
    let card = document.createElement('a');
    name = name.replace(/[^\w\s]/gi, '');

    card.classList.add('transition', 'ease-in', 'duration-100', 'delay-0', 'max-w-md', 'rounded', 'overflow-hidden', 'shadow-lg', 'mb-4', 'mr-4', 'rounded-xl', 'cursor-pointer','bg-white');
    card.id = name;
    card.href = "javascript:void(0)";

    let flex = document.createElement('div');
    flex.classList.add('flex');

    let imgContainer = document.createElement('div');
    imgContainer.classList.add('w-1/3', 'border-r', 'border-gray-300', 'rounded-l-lg', 'overflow-hidden', 'bg-white','py-0');

    let img = document.createElement('img');
    img.classList.add('scale-150', 'mt-10', 'px-2', 'w-full', 'h-auto', 'object-cover', 'object-center', 'rounded-l-lg');
    img.src = "https://firebasestorage.googleapis.com/v0/b/yu-gi-oh--card-manager.appspot.com/o/char%2F" + name.replace(' ', '%20') + ".png?alt=media&token=e50852da-0be5-434c-b3b3-fd3803fe13c7";
    img.alt = name + "_Image";
    img.loading = "lazy";

    imgContainer.classList.add('pr-2','opacity-50')
    imgContainer.appendChild(img);

    let textContainer = document.createElement('div');
    textContainer.classList.add('flex-1', 'px-6', 'py-4');

    let nameDiv = document.createElement('div');
    nameDiv.classList.add('font-bold', 'text-2xl', 'mb-2');
    
    let nameText = document.createTextNode(name);
    nameDiv.appendChild(nameText);

    let completionDiv = document.createElement('p');
    completionDiv.classList.add('text-gray-700', 'text-md', 'completionPercentage');

    if (isNaN(percentage)) {
        percentage = "No Deck Found.";
        let completionText = document.createTextNode(percentage);
        completionDiv.appendChild(completionText);
    }else{
        let completionText = document.createTextNode(percentage + "%");
        completionDiv.classList.add('border');
        completionDiv.style.background = "linear-gradient(to right, " + color + " " + percentage + "%, #ffffff " + percentage + "%)";
        completionDiv.appendChild(completionText);
        imgContainer.classList.remove('opacity-50')
        card.href = "deck_view.html?duelist=" + name;
        card.classList.add('hover:scale-110');
    }

    textContainer.appendChild(nameDiv);
    textContainer.appendChild(completionDiv);

    flex.appendChild(imgContainer);
    flex.appendChild(textContainer);

    card.appendChild(flex);
    //href is the very same page with view=deck&duelist=name
    //current url is taken from the window.location.href

    card.href = window.location.href.split('?')[0] + "?view=deck&duelist=" + name;

    return card;
}

async function loadChars(series){
    prepareForDuelists();
    //const names = ['Yugi Muto', 'Seto Kaiba', 'Anzu Mazaki','Yugi Muto', 'Seto Kaiba', 'Anzu Mazaki','Yugi Muto', 'Seto Kaiba', 'Anzu Mazaki','Yugi Muto', 'Seto Kaiba', 'Anzu Mazaki','Yugi Muto', 'Seto Kaiba', 'Anzu Mazaki','Yugi Muto', 'Seto Kaiba', 'Anzu Mazaki','Yugi Muto', 'Seto Kaiba', 'Anzu Mazaki','Yugi Muto', 'Seto Kaiba', 'Anzu Mazaki','Yugi Muto', 'Seto Kaiba', 'Anzu Mazaki','Yugi Muto', 'Seto Kaiba', 'Anzu Mazaki',]    //to retrievie via get of a series

    const names = getSeriesChars(series);

    async function processNames() {
        for (const name of names) {
            const percentage = await getCompletionPercentage(name);
            let card = createCharacterCard(name, percentage);
            document.getElementById('duelists').appendChild(card);
        }
    }

    await processNames();
}

function prepareForCards(){

    content.classList.remove('grid','h-1/5','place-items-center')
    content.innerHTML = `
    <div class="w-screen md:w-3/4 h-screen overflow-auto pr-3 pb-40 mt-1 ms-2">
        <div class="grid grid-cols-10 gap-1 h-screen place-items-center" id="card-container"></div>
    </div>`;

}


function createCardElement(card_id, deck_quantity, owned_quantity, isDeckCard = true){

    const cardContainer = document.getElementById('card-container');
    const card = document.createElement('a');
    card.classList.add('cursor-pointer', 'hover:scale-110', 'relative', 'z-50');
    //if card is expanded and would go out of the element, make it go on top of the others
    card.href = "card_view.html?card=" + card_id;

    const img = document.createElement('img');
    img.src = "https://firebasestorage.googleapis.com/v0/b/yu-gi-oh--card-manager.appspot.com/o/small_cards%2F" + card_id + ".jpg?alt=media&token=5312ec3d-15e8-4a78-9f5b-c4572d60e556";
    img.alt = card_id + "_id";
    img.classList.add('card', 'static');

    const owned = document.createElement('div');
    owned.classList.add('owned-label', 'absolute', 'bottom-0', 'right-0', 'bg-gray-900', 'text-white', 'px-1', 'py-0.5', 'rounded-tl-md', 'text-sm');
    owned.textContent = isDeckCard ? owned_quantity + "/" + deck_quantity : owned_quantity;

    if(owned_quantity < deck_quantity){
        img.classList.add('filter', 'grayscale');
    }

    card.appendChild(img);
    card.appendChild(owned);
    cardContainer.appendChild(card);

    return card;

}


async function showDeck(duelist){

    prepareForCards();
    getDeckCards(duelist).then(async (deck) => {
        const cards = deck.flat();
        cards.forEach(async card => {
            const owned_quantity = await getOwnedQuantity(card.id);
            createCardElement(card.id, card.quantity, owned_quantity);
        });
    });
}