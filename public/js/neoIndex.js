const animeDecks = document.getElementById('anime-decks');
const allDeckCards = document.getElementById('all-deck-cards');
const collection = document.getElementById('collection');
const nav = document.getElementById('nav-content')
const content = document.getElementById('content')

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

function readOnlyNav(title){
    return `<h1 class="text-sm md:text-2xl flex-1 mx-5 ms-10 mb-1" id="title">${title}</h1>
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

function controller(){
    switch(location()){
        case 'animeDecks':
            disposeNav();
            nav.innerHTML = animeDecksNav('Anime Decks');
            loadChars('duelists');

            break;
        case 'allDeckCards':
            disposeNav();
            nav.innerHTML = basicNav('All Deck Cards');
            break;
        case 'collection':
            disposeNav();
            nav.innerHTML = basicNav('Collection');
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

function prepareForDuelists(){
    content.innerHTML = `<div class="char-container flex flex-wrap justify-center" id="duelists"></div>`
}


function createCharacterCard(name, percentage) {
    let card = document.createElement('a');
    card.classList.add(
        'transition',
        'ease-in',
        'duration-100',
        'delay-0',
        'w-1/3',
        'rounded',
        'overflow-hidden',
        'shadow-lg',
        'mb-4',
        'mr-4',
        'rounded-xl',
        'cursor-pointer',
        'bg-white'
    );
    card.id = name;
    card.href = "javascript:void(0)";

    let html = `
        <div class="flex">
            <div class="w-1/3 border-r border-gray-300 rounded-l-lg overflow-hidden bg-white py-0 pr-2 opacity-50">
                <img class="scale-150 mt-10 px-2 w-full h-auto object-cover object-center rounded-l-lg" 
                
                    src="https://firebasestorage.googleapis.com/v0/b/yu-gi-oh--card-manager.appspot.com/o/char%2F${name.replace(
                    ' ','%20'
                )}.png?alt=media&token=e50852da-0be5-434c-b3b3-fd3803fe13c7" alt="${name}_Image" loading="lazy">
            </div>
            <div class="flex-1 px-6 py-4">
                <div class="font-bold text-2xl mb-2">${name}</div>
                <p class="text-gray-700 text-md completionPercentage">${percentage}%</p>
            </div>
        </div>
    `;

    card.innerHTML = html;
    return card;
}

function loadChars(series){
    prepareForDuelists();
    const names = ['Yugi Muto', 'Seto Kaiba', 'Anzu Mazaki','Yugi Muto', 'Seto Kaiba', 'Anzu Mazaki',]    //to retrievie via get of a series

    names.forEach(name => {
        let card = createCharacterCard(name, 100);
        document.getElementById('duelists').appendChild(card);
    });
}