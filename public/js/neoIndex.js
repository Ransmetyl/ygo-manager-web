import {
    getCompletionPercentage, 
    getDeckCards,
    getOwnedQuantity, 
    countDeckCards, 
    countOwnedCards, 
    getOwnedCards, 
    getAllDeckCards,
    searchInOwned,
    searchInAllDecks,
    getOtherData,
} from './firebase.js';

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

function basicNav(title, cardsCount, isCollection){
    const page = isCollection == true ? "neoIndex2.html?view=collection" : "neoIndex2.html?view=allDeckCards";
    
    return `<h1 class="text-sm md:text-2xl flex-1 mx-5 ms-10 mb-1" id="title">${title}</h1>
    <div class="flex items center">
        <button id="add" type="button" class="mx-3 inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">Add</button>
        <button id="remove" type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:mt-0 sm:w-auto">Remove</button>
    </div>
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
            <div class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
            <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                <a href="${page}&sort=default" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Default</a>
                <a href="${page}&sort=type" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Type</a>
                <a href="${page}&sort=name" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Name</a>
                <a href="${page}&sort=quantityAsc" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Quantity Asc.</a>
                <a href="${page}&sort=quantityDesc" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Quantity Desc.</a>
            </div>
            </div>
        </div>
    </div>
    <div class="flex items-center rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 mx-2 p-1.5">
        <p id="totalCards" class="text-gray-900 font-bold px-1">${cardsCount}</p>
    </div>
    `
}

function dropdown(){
    document.addEventListener('DOMContentLoaded', function() {
        
        const menuButton = document.getElementById('menu-button');
        const dropdownMenu = document.querySelector('.absolute.right-0');
        dropdownMenu.classList.add('hidden');

        menuButton.addEventListener('click', function() {

            const expanded = menuButton.getAttribute('aria-expanded') === 'true' || false;
            menuButton.setAttribute('aria-expanded', !expanded);
            dropdownMenu.classList.toggle('hidden');
        });
      
        // Chiudi il menu quando si clicca fuori da esso
        document.addEventListener('click', function(event) {
          const isClickInside = dropdownMenu.contains(event.target) || menuButton.contains(event.target);
          if (!isClickInside) {
            menuButton.setAttribute('aria-expanded', 'false');
            dropdownMenu.classList.add('hidden');
          }
        });
      });

}

function getSeries(){
    return window.location.href.split('series=')[1] || 'duel-monsters';
}

function getSortBy(){
    return window.location.href.split('sort=')[1] || 'default';
}

function animeDecksNav(title){
    //TODO: cambiare nomeIndex

    const series = getSeries();
    return `<h1 class="text-sm md:text-2xl flex-1 mx-5 ms-10 mb-1" id="title">${title}</h1>
    <div class="relative inline-block text-left me-5">
        <div>
            
        <div class="flex flex-row">
            <div class="inline-flex rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mx-2" id="seriesCompletion">100.00%</div>
                <button type="button" class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
                    <span class="hidden md:inline">Series: </span>
                    <span class="text-gray-600" id="seriesText">${series}</span>
                    <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                    </svg>
                </button>
        </div>
            <div class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                    <a href="neoIndex2.html?view=animeDecks&series=duel-monsters" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Duel Monsters</a>
                    <a href="neoIndex2.html?view=animeDecks&series=GX" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">GX</a>
                    <a href="neoIndex2.html?view=animeDecks&series=5Ds" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">5Ds</a>
                    <a href="neoIndex2.html?view=animeDecks&series=Zexal" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Zexal</a>
                    <a href="neoIndex2.html?view=animeDecks&series=Arc-V" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Arc-V</a>
                    <a href="neoIndex2.html?view=animeDecks&series=Vrains" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Vrains</a>
                </div>
            </div>
        </div>
    </div>
    
    `
}

function setSeriesCompletion(value){
    document.getElementById('seriesCompletion').innerHTML = value + '%';
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
    const view = location()?.split('&')[0] || 'animeDecks';

    switch(view){
        case 'animeDecks':
            const series = getSeries();
            const lastChoice = localStorage.getItem('lastChoice');
            if (lastChoice && lastChoice === series) {
                nav.innerHTML = animeDecksNav('Anime Decks');
                dropdown();
                loadChars(series);
            } else {
                localStorage.setItem('lastChoice', series);
                nav.innerHTML = animeDecksNav('Anime Decks');
                dropdown();
                loadChars(series);
            }

            document.title = 'Anime Decks';
            break;

        case 'allDeckCards':
            nav.innerHTML = basicNav('All Deck Cards', "...",false);
            dropdown();
            console.log(getSortBy());
            let total = showAllDeckCards();
            total.then(count => setTotalCards(count));
          
            document.title = 'All Deck Cards';
            break;
        case 'collection':
            nav.innerHTML = basicNav('Collection', "...",true);
            dropdown();
            showCollection();
            // countOwnedCards().then(count => {
            //     //nav.innerHTML = basicNav('Collection', count,true);
            //     //TODO: set count invece di far sta roba

            //     console.log(getSortBy());
            //     showCollection();
            // });
            document.title = 'Collection';
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
            document.title = duelist + "'s Deck";
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
    content.innerHTML = loader();
}

function prepareForDuelists(){
    content.classList.remove('grid','h-1/5','place-items-center')
    content.classList.add('h-screen','overflow-auto')
    content.innerHTML = `<div class="char-container flex flex-wrap justify-center overflow-y-auto mb-32" id="duelists"></div>`
}

function createCharacterCard(name, percentage) {

    const color = getColorFromPercentage(percentage);
    let card = document.createElement('a');
    name = name.replace(/[^\w\s-]/gi, '');

    card.classList.add('w-1/3','transition', 'ease-in', 'duration-100', 'delay-0', 'max-w-md', 'rounded', 'overflow-hidden', 'shadow-lg', 'm-2', 'mr-4', 'rounded-xl', 'cursor-pointer','bg-white');
    card.id = name;
    card.href = "javascript:void(0)";

    let flex = document.createElement('div');
    flex.classList.add('flex');

    let imgContainer = document.createElement('div');
    imgContainer.classList.add('w-1/3', 'border-r', 'border-gray-300', 'rounded-l-lg', 'overflow-hidden', 'bg-white','py-0');

    let img = document.createElement('img');
    img.classList.add('scale-150','my-5', 'px-2', 'w-full', 'h-auto', 'object-cover', 'object-center', 'rounded-l-lg');
    img.src = "https://firebasestorage.googleapis.com/v0/b/yu-gi-oh--card-manager.appspot.com/o/char%2F" + name.replace(' ', '%20') + ".png?alt=media&token=e50852da-0be5-434c-b3b3-fd3803fe13c7";
    img.alt = name + "_image";
    img.loading = "lazy";

    imgContainer.classList.add('pr-2','opacity-50')
    imgContainer.appendChild(img);

    let textContainer = document.createElement('div');
    textContainer.classList.add('flex-1', 'px-6', 'py-4', 'flex', 'flex-col', 'justify-center');

    let nameDiv = document.createElement('div');
    nameDiv.classList.add('font-bold', 'text-2xl', 'mb-2');

    let displayName = name.replace('Arc-V', '');
    if(displayName == 'Austin O Brien'){
        displayName = 'Austin O\' Brien';
    }

    if(displayName == 'Jose'){
        displayName = 'José';
    }

    let nameText = document.createTextNode(displayName);
    nameDiv.appendChild(nameText);

    let completionDiv = document.createElement('p');
    completionDiv.classList.add('text-gray-700', 'text-md', 'completionPercentage');

    if (isNaN(percentage)) {
        percentage = "No Deck Found.";
        let completionText = document.createTextNode(percentage);
        completionDiv.appendChild(completionText);
        
    }else{
        let completionText = document.createTextNode(percentage + "%");
        completionDiv.classList.add('border', 'rounded-md', 'border-black');
        completionDiv.style.background = "linear-gradient(to right, " + color + " " + percentage + "%, #ffffff " + percentage + "%)";
        completionDiv.appendChild(completionText);
        imgContainer.classList.remove('opacity-50')
        card.href = window.location.href.split('?')[0] + "?view=deck&duelist=" + name;
        card.classList.add('hover:scale-110');
    }

    textContainer.appendChild(nameDiv);
    textContainer.appendChild(completionDiv);

    flex.appendChild(imgContainer);
    flex.appendChild(textContainer);

    card.appendChild(flex);
    

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
    content.classList.add('h-screen','w-full', 'flex')
    content.innerHTML = `
        <div class="w-3/4 h-screen overflow-auto pr-3 pb-24 mt-1 ms-2">
            <div class="grid grid-cols-10 gap-1 h-auto" id="card-container" data-infinite-scroll='{ "path": ".pagination__next", "append": ".post", "history": false }'></div>
        </div>
        <div class="w-1/4 h-screen ms-2" id="card-highlight">
            <img class="w-3/4 h-auto object-cover p-2 mx-auto " id="card_image" src="../card_back.jpg" alt="highlight_card_image">
            <p class="text-center text-white bg-gray-900 p-1 mx-2 rounded-md font-bold" id="card_name"></p>
            <p class="h-1/3 text-white bg-gray-900 p-1 m-2 rounded-md overflow-auto text-sm p-3 text-justify">
                <span id="card_data"></span>
                <br>
                <span id="card_desc"></span>
            </p>
        </div>
    
    `;

}

function createCardElement(card_id, deck_quantity, owned_quantity, card_name, card_desc, isDeckCard = true) {
    preloadImages([`https://firebasestorage.googleapis.com/v0/b/yu-gi-oh--card-manager.appspot.com/o/small_cards%2F${card_id}.jpg?alt=media&token=5312ec3d-15e8-4a78-9f5b-c4572d60e556`]);
    
    const cardContainer = document.getElementById('card-container');
    const card = document.createElement('a');
    card.classList.add('cursor-pointer', 'hover:scale-110', 'relative', 'z-50');
    let card_name_fix = card_name
    if(card_name.includes('-')){
        card_name_fix = card_name.replace(/\s*-\s*/g, '-');
    }
    if (card_name.includes("'")) {
        card_name_fix = card_name.replace("'", "");
    }
    if (card_name.includes(",")) {
        card_name_fix = card_name.replace(",", "");
    }

    card_name_fix = card_name_fix.replace(/\s+/g, '-');
    card.href = `https://www.cardmarket.com/en/YuGiOh/Cards/${card_name_fix}?language=5&minCondition=2`;
    card.target="_blank"

    const img = document.createElement('img');
    img.src = `https://firebasestorage.googleapis.com/v0/b/yu-gi-oh--card-manager.appspot.com/o/small_cards%2F${card_id}.jpg?alt=media&token=5312ec3d-15e8-4a78-9f5b-c4572d60e556`;
    img.alt = `${card_id}_id`;
    img.classList.add('card', 'static');

    const owned = document.createElement('div');
    owned.classList.add('owned-label', 'absolute', 'bottom-0', 'right-0', 'bg-gray-900', 'text-white', 'px-1', 'py-0.5', 'rounded-tl-md', 'text-sm');
    owned.textContent = isDeckCard ? `${owned_quantity}/${deck_quantity}` : owned_quantity;

    if (owned_quantity < deck_quantity) {
        img.classList.add('filter', 'grayscale');
    }

    card.addEventListener('mouseover', () => {
        showHighlightCard(card_id, card_name, card_desc);
    });

    card.appendChild(img);
    card.appendChild(owned);
    cardContainer.appendChild(card);
    return card;
}

function preloadImages(urls) {
    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}


function showHighlightCard(card_id, card_name, card_desc) {
    const highlightImageUrl = `https://firebasestorage.googleapis.com/v0/b/yu-gi-oh--card-manager.appspot.com/o/cards%2F${card_id}.jpg?alt=media&token=5312ec3d-15e8-4a78-9f5b-c4572d60e556`;

    preloadImages([highlightImageUrl]);

    getOtherData(card_id).then(data => {
        const [type, attribute] = data;
        const card_data = `${type}/${attribute}`;
        document.getElementById('card_data').textContent = card_data;
        document.getElementById('card_desc').textContent = card_desc;
    });

    document.getElementById('card_image').src = highlightImageUrl;
    document.getElementById('card_name').textContent = card_name;
   
}

async function showDeck(duelist) {
    prepareForCards();
    const deck = await getDeckCards(duelist);
    const cards = deck.flat();
    cards.forEach(async card => {
        const owned_quantity = await getOwnedQuantity(card.id);
        console.log(card.name);
        createCardElement(card.id, card.quantity, owned_quantity, card.name, card.desc);
    });
    showHighlightCard(cards[0].id, cards[0].name, cards[0].desc);
}

async function showCollection(){
    prepareForCards();
    const deck = await getOwnedCards(getSortBy());
    const cards = deck.flat();
    const promises = cards.map(async card => {
        const owned_quantity = await getOwnedQuantity(card.id);
        return createCardElement(card.id, card.quantity, owned_quantity, card.name, card.desc, false);
    });
    const cardElements = Promise.all(promises);
    setTotalCards(await countOwnedCards());
    showHighlightCard(cards[0].id, cards[0].name, cards[0].desc);
    activateSearchbar();
    return cardElements;
}

async function activateSearchbar() {
    //TODO: fare in modo che invece di cercare, fa un redirect e oltre a tutto c'è una roba chiamata q = nome_carta
    const searchbar = document.getElementById('searchbar');
    const location = window.location.href.split('?view=')[1];

    switch (location) {
        case 'collection':
            searchbar.addEventListener('keydown', async (event) => {
                if (event.key === 'Enter') {
                    resetContent();
                    const card_name = searchbar.value.toLowerCase();
                    if (card_name === '') return;

                    const result = await searchInOwned(card_name);
                    document.getElementById('content').innerHTML = '';
                    prepareForCards();
                    const cards = result.flat();
                    setTotalCards(cards.length);
                    cards.forEach(async card => {
                        const owned_quantity = await getOwnedQuantity(card.id);
                        createCardElement(card.id, card.quantity, owned_quantity, card.name, card.desc, false);
                    });
                }
            });

            searchbar.addEventListener('keyup', () => {
                if (searchbar.value === '') {
                    prepareForCards();
                    showCollection();
                }
            });
            break;

        case 'allDeckCards':
            searchbar.addEventListener('keydown', async (event) => {
                if (event.key === 'Enter') {
                    resetContent();
                    console.log('searching in all deck cards');
                    const card_name = searchbar.value.toLowerCase();
                    if (card_name === '') return;
                    const result = await searchInAllDecks(card_name,getSortBy());
                    document.getElementById('content').innerHTML = ''; // Clear the content before displaying the search results
                    prepareForCards();
                    const cards = result.flat();
                    const uniqueCards = Array.from(new Set(cards.map(card => card.id))).map(id => cards.find(card => card.id === id));
                    setTotalCards(uniqueCards.length);
                    uniqueCards.forEach(async card => {
                        const owned_quantity = await getOwnedQuantity(card.id);
                        createCardElement(card.id, card.quantity, owned_quantity, card.name, card.desc, true);
                    });
                }
            });

            searchbar.addEventListener('keyup', async() => {
                if (searchbar.value === '') {
                    resetContent(); // Clear the content before displaying all deck cards
                    prepareForCards();
                    setTotalCards(await showAllDeckCards());   
                }
            });
            break;
    }
}


function setTotalCards(count){
    document.getElementById('totalCards').textContent = count;
}

async function showAllDeckCards() {
    prepareForCards();
    let total = 0;
    const cards = await getAllDeckCards(getSortBy());
    const promises = cards.flat().map(async card => {
        const owned_quantity = await getOwnedQuantity(card.id);
        total += owned_quantity;
        return createCardElement(card.id, card.quantity, owned_quantity, card.name, card.desc);
    });
    Promise.all(promises);
    showHighlightCard(cards[0].id, cards[0].name, cards[0].desc);
    activateSearchbar();

    return total; //returns the total number of cards 
}



