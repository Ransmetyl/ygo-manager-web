
import { completionPercentage } from "./deck.js";
import { dropDown } from "./nav.js";

dropDown();

const collectionBtn = document.getElementById('collectionBtn');
const allCardsBtn = document.getElementById('allCardsBtn');

if(window.innerWidth < 768){
    collectionBtn.textContent = "Possedute";
    allCardsBtn.textContent = "Deck";
}

window.addEventListener('resize', function(){
    if(window.innerWidth < 768){
        collectionBtn.textContent = "Possedute";
        allCardsBtn.textContent = "Deck"
    }else{
        collectionBtn.textContent = "Carte Possedute";
        allCardsBtn.textContent = "Carte Deck"
    }
});

let selection = new URLSearchParams(window.location.search).get('series') || 'duel-monsters';

if(selection){
    const series = ['duel-monsters', 'gx', '5ds', 'zexal', 'arc-v', 'vrains'];
    if (!series.includes(selection)) {
        selection = 'duel-monsters';
    }
}

createCharProfiles(selection);


function setSeriesChars(series){
    
    let names = [];

    switch(series){
        case 'duel-monsters':
            
        names = [
                'Yami Yugi',
                'Yugi Muto',
                'Seto Kaiba',
                'Jonouchi Katsuya',
                'Anzu Mazaki',
                'Hiroto Honda',
                'Ryuji Otogi',
                'Mai Kujaku',
                'Insector Haga',
                'Dinosaur Ryuzaki',
                'Ghost Kotsuzuka',
                'Bandit Keith',
                'Bakura Ryou',
                'Labyrinth Brothers',
                'Pegasus J. Crawford',
                'Esper Roba',
                'Pandora',
                'Marik Ishtar',
                'Ishizu Ishtar',
                'Rishid',
                'Noah Kaiba',
                'Gozaburo Kaiba',
                'Rafael',
                'Dartz',
                'Zigfried von Schroeder',
                'Leon von Schroeder',
                'Rebecca Hawkins',
                'Anubis',
                'Aigami'

            ];

            break;

        case 'gx':
            names = [
                //Season 1
                'Judai Yuki',
                'Jun Manjoume',
                'Ryo Marufuji',

                'Sho Marufuji',
                'Asuka Tenjoin',
                'Daichi Misawa',
                'Hayato Maeda',
                'Chronos de Medici',
                'Kagemaru',

                //Season 2
                'Edo Phoenix',
                'Tyrano Kenzan',
                'Saio Takuma',

                //Season 3
                'Johan Andersen',
                'Austin O\'Brien',
                'Jim Crocodile Cook',
                'Amon Garam',
                'Supreme King',
                'Yubel',

                //Season 4
                'Darkness'
            ]
            break;

        case '5ds':
            names = [
                //Signers
                'Yusei Fudo',
                'Jack Atlas',
                'Crow Hogan',
                'Aki Izayoi',
                'Rua',
                'Luca',
                
                'Tetsu Ushio',

                //Dark Signers
                'Kiryu Kyosuke',
                'Carly Nagisa',
                'Misty Lola',
                'Demak',
                'Bommer',
                'Rudger Godwin',
                'Rex Godwin',

                //WRGP
                'Bruno',
                'Sherry LeBlanc',
                'Paradox',
                'Aporia',
                'Z-One'
            ];
            break;

        case 'zexal':
            names = [
                'Yuma Tsukumo', 
                'Shark', 
                'Kaito Tenjo', 
                'Astral', 
                'Kotori Mizuki',
                'Tetsuo Takeda',
                'Tokunosuke Omoteura',
                'Cathy Katherine',
                'Takashi Todoroki',
                'Anna Kozuki',
                'Trey', 
                'Quattro',
                'Quinton',
                'Tron',
                'Droite',
                'Gauche',
                'Kaze',
                'Dumon',
                'Rio Kamishiro',
                'Vector',
                'Alito',
                'Girag',
                'Mizar',
                'Don Thousand'
            ];
            break;
        
        case 'arc-v':
            names = [
                //Yuya's counterparts
                'Yuya Sakaki',
                'Ute',
                'Hugo',
                'Joeri',

                'Reiji Akaba',

                //Yuzu's counterparts
                'Yuzu Hiragi',
                'Serena',
                'Rin',
                'Ruri',
                'Gongenzaka Noboru',
                'Sawatari Shingo',
                'Shun Kurosaki',
                'Sora Shiunin',
                'Dennis Macfield',
                'Tsukikage',
                'Yusho Sakaki',
                'Jack Atlas Arc-V',
                'Crow Hogan Arc-V',
                'Kaito Tenjo Arc-V',
                'Asuka Tenjoin Arc-V',
                'Edo Phoenix Arc-V',
                'Zarc',

            ];
            break;

        case 'vrains':
            names = [
                'Yusaku Fujiki',    //Playmaker
                'Ryoken Kogami',    //Varis
                'Takeru Homura',    //Soulburner

                'Aoi Zaizen',       //Blue Angel and Blue Maiden
                'Go Onizuka',       //The Gore
                'Spectre'         
                //...  
            ];

            break;
    }
    return names;
}

function createCharProfiles(series){
 
    let names = setSeriesChars(series);

    names.forEach(name => {
 
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
        completionDiv.innerHTML = "Loading...";

        completionPercentage(name).then((percentage) => {
            completionDiv.innerHTML = "";
            if (isNaN(percentage)) {
                percentage = "No Deck Found.";
                let completionText = document.createTextNode(percentage);
                completionDiv.appendChild(completionText);
            }else{
                let completionText = document.createTextNode(percentage + "%");
                let color = getColorFromPercentage(percentage);
                completionDiv.classList.add('border');
                completionDiv.style.background = "linear-gradient(to right, " + color + " " + percentage + "%, #ffffff " + percentage + "%)";
                completionDiv.appendChild(completionText);
                imgContainer.classList.remove('opacity-50')
                card.href = "deck_view.html?duelist=" + name;
                card.classList.add('hover:scale-110');

            }
          
        });

        textContainer.appendChild(nameDiv);
        textContainer.appendChild(completionDiv);
        flex.appendChild(imgContainer);
        flex.appendChild(textContainer);
        card.appendChild(flex);
       // console.log(series);
        document.getElementById(series).appendChild(card);
    });
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
