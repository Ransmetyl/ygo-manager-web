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

export {setSeriesChars}