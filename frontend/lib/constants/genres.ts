export interface Genre {
    name: string;
    children?: Genre[];
}

export const MUSIC_GENRES: Genre[] = [
    {
        name: 'Alternative',
        children: [
            { name: 'Art Punk' },
            { name: 'Alternative Rock' },
            { name: 'Britpunk' },
            { name: 'College Rock' },
            { name: 'Crossover Thrash' },
            { name: 'Crust Punk' },
            { name: 'Emotional Hardcore' },
            { name: 'Experimental Rock' },
            { name: 'Folk Punk' },
            { name: 'Goth / Gothic Rock' },
            { name: 'Grunge' },
            { name: 'Hardcore Punk' },
            { name: 'Hard Rock' },
            { name: 'Indie Rock' },
            { name: 'Lo-fi' },
            { name: 'Musique Concrète' },
            { name: 'New Wave' },
            { name: 'Progressive Rock' },
            { name: 'Punk' },
            { name: 'Shoegaze' },
            { name: 'Steampunk' },
        ]
    },
    { name: 'Anime' },
    {
        name: 'Blues',
        children: [
            { name: 'Acoustic Blues' },
            { name: 'African Blues' },
            { name: 'Blues Rock' },
            { name: 'Blues Shouter' },
            { name: 'British Blues' },
            { name: 'Canadian Blues' },
            { name: 'Chicago Blues' },
            { name: 'Classic Blues' },
            { name: 'Classic Female Blues' },
            { name: 'Contemporary Blues' },
            { name: 'Contemporary R&B' },
            { name: 'Country Blues' },
            { name: 'Dark Blues' },
            { name: 'Delta Blues' },
            { name: 'Detroit Blues' },
            { name: 'Doom Blues' },
            { name: 'Electric Blues' },
            { name: 'Folk Blues' },
            { name: 'Gospel Blues' },
            { name: 'Harmonica Blues' },
            { name: 'Hill Country Blues' },
            { name: 'Hokum Blues' },
            { name: 'Jazz Blues' },
            { name: 'Jump Blues' },
            { name: 'Kansas City Blues' },
            { name: 'Louisiana Blues' },
            { name: 'Memphis Blues' },
            { name: 'Modern Blues' },
            { name: 'New Orlean Blues' },
            { name: 'NY Blues' },
            { name: 'Piano Blues' },
            { name: 'Piedmont Blues' },
            { name: 'Punk Blues' },
            { name: 'Ragtime Blues' },
            { name: 'Rhythm Blues' },
            { name: 'Soul Blues' },
            { name: 'St. Louis Blues' },
            { name: 'Swamp Blues' },
            { name: 'Texas Blues' },
            { name: 'Urban Blues' },
            { name: 'Vandeville' },
            { name: 'West Coast Blues' },
            { name: 'Zydeco' },
        ],
    },
    {
        name: 'Children’s Music',
        children: [
            { name: 'Lullabies' },
            { name: 'Sing-Along' },
            { name: 'Stories' },
        ]
    },
    {
        name: 'Classical',
        children: [
            { name: 'Avant-Garde' },
            { name: 'Ballet' },
            { name: 'Baroque' },
            { name: 'Cantata' },
            {
                name: 'Chamber Music',
                children: [
                    { name: 'String Quartet' }
                ]
            },
            { name: 'Chant' },
            { name: 'Choral' },
            { name: 'Classical Crossover' },
            { name: 'Concerto' },
            { name: 'Concerto Grosso' },
            { name: 'Contemporary Classical' },
            { name: 'Early Music' },
            { name: 'Expressionist' },
            { name: 'High Classical' },
            { name: 'Impressionist' },
            { name: 'Mass Requiem' },
            { name: 'Medieval' },
            { name: 'Minimalism' },
            { name: 'Modern Composition' },
            { name: 'Modern Classical' },
            { name: 'Opera' },
            { name: 'Oratorio' },
            { name: 'Orchestral' },
            { name: 'Organum' },
            { name: 'Renaissance' },
            { name: 'Romantic (early period)' },
            { name: 'Romantic (later period)' },
            { name: 'Sonata' },
            { name: 'Symphonic' },
            { name: 'Symphony' },
            { name: 'Twelve-tone' },
            { name: 'Wedding Music' },
        ]
    },
    {
        name: 'Comedy',
        children: [
            { name: 'Novelty' },
            { name: 'Parody Music' },
            { name: 'Stand-up Comedy' },
            { name: 'Vaudeville' },
        ]
    },
    {
        name: 'Commercial',
        children: [
            { name: 'Jingles' },
            { name: 'TV Themes' },
        ]
    },
    {
        name: 'Country',
        children: [
            { name: 'Alternative Country' },
            { name: 'Americana' },
            { name: 'Australian Country' },
            { name: 'Bakersfield Sound' },
            { name: 'Blues Country' },
            { name: 'Cajun Fiddle Tunes' },
            { name: 'Christian Country' },
            { name: 'Classic Country' },
            { name: 'Close Harmony' },
            { name: 'Contemporary Bluegrass' },
            { name: 'Contemporary Country' },
            { name: 'Country Gospel' },
            { name: 'Country Pop' },
            { name: 'Country Rap' },
            { name: 'Country Rock' },
            { name: 'Country Soul' },
            { name: 'Cowboy / Western' },
            { name: 'Cowpunk' },
            { name: 'Dansband' },
            { name: 'Honky Tonk' },
            { name: 'Franco-Country' },
            { name: 'Gulf and Western' },
            { name: 'Hellbilly Music' },
            { name: 'Instrumental Country' },
            { name: 'Lubbock Sound' },
            { name: 'Nashville Sound' },
            { name: 'Neotraditional Country' },
            { name: 'Outlaw Country' },
            { name: 'Progressive' },
            { name: 'Psychobilly / Punkabilly' },
            { name: 'Red Dirt' },
            { name: 'Sertanejo' },
            { name: 'Texas County' },
            { name: 'Traditional Bluegrass' },
            { name: 'Traditional Country' },
            { name: 'Truck-Driving Country' },
            { name: 'Urban Cowboy' },
            { name: 'Western Swing' },
            { name: 'Zydeco' },
            {
                name: 'Bluegrass',
                children: [
                    { name: 'Progressive Bluegrass' },
                    { name: 'Reactionary Bluegrass' }
                ]
            }
        ]
    },
    {
        name: 'Dance & EDM',
        children: [
            { name: 'Club / Club Dance' },
            { name: 'Breakcore' },
            { name: 'Brostep' },
            { name: 'Chillstep' },
            { name: 'Deep House' },
            { name: 'Dubstep' },
            { name: 'Electro House' },
            { name: 'Electroswing' },
            { name: 'Exercise' },
            { name: 'Future Garage' },
            { name: 'Garage' },
            { name: 'Glitch Hop' },
            { name: 'Glitch Pop' },
            { name: 'Grime' },
            { name: 'Hard Dance' },
            { name: 'Hi-NRG / Eurodance' },
            { name: 'Horrorcore' },
            { name: 'Jackin House' },
            { name: 'Jungle / Drum’n’bass' },
            { name: 'Liquid Dub' },
            { name: 'Regstep' },
            { name: 'Speedcore' },
            { name: 'Trap' },
            {
                name: 'Breakbeat / Breakstep',
                children: [
                    { name: '4-Beat' },
                    { name: 'Acid Breaks' },
                    { name: 'Baltimore Club' },
                    { name: 'Big Beat' },
                    { name: 'Breakbeat Hardcore' },
                    { name: 'Broken Beat' },
                    { name: 'Florida Breaks' },
                    { name: 'Nu Skool Breaks' },
                ]
            },
            {
                name: 'Hardcore',
                children: [
                    { name: 'Bouncy House' },
                    { name: 'Bouncy Techno' },
                    { name: 'Breakcore' },
                    { name: 'Digital Hardcore' },
                    { name: 'Doomcore' },
                    { name: 'Dubstyle' },
                    { name: 'Gabber' },
                    { name: 'Happy Hardcore' },
                    { name: 'Hardstyle' },
                    { name: 'Jumpstyle' },
                    { name: 'Makina' },
                    { name: 'Speedcore' },
                    { name: 'Terrorcore' },
                    { name: 'Uk Hardcore' },
                ]
            },
            {
                name: 'House',
                children: [
                    { name: 'Acid House' },
                    { name: 'Chicago House' },
                    { name: 'Deep House' },
                    { name: 'Diva House' },
                    { name: 'Dutch House' },
                    { name: 'Electro House' },
                    { name: 'Freestyle House' },
                    { name: 'French House' },
                    { name: 'Funky House' },
                    { name: 'Ghetto House' },
                    { name: 'Hardbag' },
                    { name: 'Hip House' },
                    { name: 'Italo House' },
                    { name: 'Latin House' },
                    { name: 'Minimal House' },
                    { name: 'Progressive House' },
                    { name: 'Rave Music' },
                    { name: 'Swing House' },
                    { name: 'Tech House' },
                    { name: 'Tribal House' },
                    { name: 'Tropical House' },
                    { name: 'UK Hard House' },
                    { name: 'US Garage' },
                    { name: 'Vocal House' },
                ]
            },
            {
                name: 'Techno',
                children: [
                    { name: 'Acid Techno' },
                    { name: 'Detroit Techno' },
                    { name: 'Free Tekno' },
                    { name: 'Ghettotech' },
                    { name: 'Minimal' },
                    { name: 'Nortec' },
                    { name: 'Schranz' },
                    { name: 'Techno-Dnb' },
                    { name: 'Technopop' },
                    { name: 'Tecno Brega' },
                    { name: 'Toytown Techno' },
                ]
            },
            {
                name: 'Trance',
                children: [
                    {
                        name: 'Uplifting Trance',
                        children: [
                            { name: 'Orchestral Uplifting' }
                        ]
                    },
                    {
                        name: 'Goa Trance',
                        children: [
                            { name: 'Dark Psytrance' },
                            { name: 'Full on' },
                            { name: 'Psybreaks' },
                            { name: 'Psyprog' },
                            { name: 'Suomisaundi' },
                        ]
                    },
                    { name: 'Acid Trance' },
                    { name: 'Acid-House' },
                    { name: 'Classic Trance' },
                    { name: 'Dark Psy' },
                    { name: 'Deep House' },
                    { name: 'Dream Trance' },
                    { name: 'Hard Trance' },
                    { name: 'Prog. Trance' },
                    { name: 'Psy-Trance' },
                    { name: 'Minimal Techno' },
                    { name: 'Tech House' },
                    { name: 'Tech Trance' },
                    { name: 'Vocal Trance' },
                ]
            },
        ]
    },
    { name: 'Disney' },
    {
        name: 'Easy Listening',
        children: [
            { name: 'Background' },
            { name: 'Bop' },
            { name: 'Elevator' },
            { name: 'Furniture' },
            { name: 'Lounge' },
            { name: 'Middle of the Road' },
            { name: 'Swing' },
        ]
    },
    {
        name: 'Electronic',
        children: [
            { name: '2-Step' },
            { name: '8bit' },
            { name: 'Asian Underground' },
            { name: 'Bassline' },
            { name: 'Chillwave' },
            { name: 'Crunk' },
            { name: 'Electro-swing' },
            { name: 'Hardstyle' },
            { name: 'IDM/Experimental' },
            { name: 'Industrial' },
            { name: 'Trip Hop' },
            {
                name: 'Ambient',
                children: [
                    { name: 'Ambient Dub' },
                    { name: 'Ambient House' },
                    { name: 'Ambient Techno' },
                    { name: 'Dark Ambient' },
                    { name: 'Drone Music' },
                    { name: 'Illbient' },
                    { name: 'Isolationism' },
                    { name: 'Lowercase' },
                ]
            },
            {
                name: 'Chiptune',
                children: [
                    { name: 'Bitpop' },
                    { name: 'Game Boy' },
                    { name: 'Nintendocore' },
                    { name: 'Video Game Music' },
                ]
            },
            {
                name: 'Downtempo',
                children: [
                    { name: 'Acid Jazz' },
                    { name: 'Balearic Beat' },
                    { name: 'Chill Out' },
                    { name: 'Dub Music' },
                    { name: 'Dubtronica' },
                    { name: 'Ethnic Electronica' },
                    { name: 'Moombahton' },
                    { name: 'Nu Jazz' },
                    { name: 'Trip Hop' },
                ]
            },
            {
                name: 'Drum & Bass',
                children: [
                    { name: 'Darkcore' },
                    { name: 'Darkstep' },
                    { name: 'Drumfunk' },
                    { name: 'Drumstep' },
                    { name: 'Hardstep' },
                    { name: 'Intelligent Drum and Bass' },
                    { name: 'Jump-Up' },
                    { name: 'Liquid Funk' },
                    { name: 'Neurofunk' },
                    { name: 'Raggacore' },
                    { name: 'Sambass' },
                    { name: 'Techstep' },
                    {
                        name: 'Oldschool Jungle',
                        children: [
                            { name: 'Darkside Jungle' },
                            { name: 'Ragga Jungle' },
                        ]
                    }
                ]
            },
            {
                name: 'Electro',
                children: [
                    { name: 'Crunk' },
                    { name: 'Electro Backbeat' },
                    { name: 'Electro-Grime' },
                    { name: 'Electropop' },
                ]
            },
            {
                name: 'Electroacoustic',
                children: [
                    { name: 'Acousmatic Music' },
                    { name: 'Computer Music' },
                    { name: 'Electroacoustic Improvisation' },
                    { name: 'Field Recording' },
                    { name: 'Live Coding' },
                    { name: 'Live Electronics' },
                    { name: 'Soundscape Composition' },
                    { name: 'Tape Music' },
                ]
            },
            {
                name: 'Electronica',
                children: [
                    { name: 'Berlin School' },
                    { name: 'Chillwave' },
                    { name: 'Electronic Art Music' },
                    { name: 'Electronic Dance Music' },
                    { name: 'Folktronica' },
                    { name: 'Freestyle Music' },
                    { name: 'Glitch' },
                    { name: 'Idm' },
                    { name: 'Laptronica' },
                    { name: 'Skweee' },
                    { name: 'Sound Art' },
                    { name: 'Synthcore' },
                ]
            },
            {
                name: 'Electronic Rock',
                children: [
                    { name: 'Dance-Punk' },
                    { name: 'Dance-Rock' },
                    { name: 'Dark Wave' },
                    { name: 'Electroclash' },
                    { name: 'Electronicore' },
                    { name: 'Electropunk' },
                    { name: 'Ethereal Wave' },
                    { name: 'Indietronica' },
                    { name: 'New Rave' },
                    { name: 'Space Rock' },
                    { name: 'Synthpop' },
                    { name: 'Synthpunk' },
                    {
                        name: 'Alternative Dance',
                        children: [
                            { name: 'Baggy' },
                            { name: 'Madchester' }
                        ]
                    }
                ]
            },
            {
                name: 'Eurodance',
                children: [
                    { name: 'Bubblegum Dance' },
                    { name: 'Italo Dance' },
                    { name: 'Turbofolk' },
                ]
            },
            {
                name: 'Hi-Nrg',
                children: [
                    { name: 'Eurobeat' },
                    { name: 'Hard Nrg' },
                    { name: 'New Beat' },
                ]
            },
            {
                name: 'Vaporwave',
                children: [
                    { name: 'Hyponagogic' },
                    { name: 'Vektroid' },
                    { name: 'Mallsoft' },
                    { name: 'Vaportrap' },
                    { name: 'Vaporhop' },
                    { name: 'Protovapor' },
                ]
            },
            {
                name: 'UK Garage',
                children: [
                    { name: '2-Step' },
                    { name: '4×4' },
                    { name: 'Bassline' },
                    { name: 'Grime' },
                    { name: 'Speed Garage' },
                ]
            }
        ]
    },
    { name: 'Enka' },
    { name: 'French Pop' },
    {
        name: 'Folk Music',
        children: [
            { name: 'American Folk Revival' },
            { name: 'Anti-Folk' },
            { name: 'British Folk Revival' },
            { name: 'Contemporary Folk' },
            { name: 'Filk Music' },
            { name: 'Freak Folk' },
            { name: 'Indie Folk' },
            { name: 'Industrial Folk' },
            { name: 'Neofolk' },
            { name: 'Progressive Folk' },
            { name: 'Psychedelic Folk' },
            { name: 'Sung Poetry' },
            { name: 'Techno-Folk' },
        ]
    },
    { name: 'German Folk' },
    { name: 'German Pop' },
    { name: 'Fitness & Workout' },
    {
        name: 'Hip-Hop/Rap',
        children: [
            { name: 'Alternative Rap' },
            { name: 'Avant-Garde' },
            { name: 'Bounce' },
            { name: 'Chap Hop' },
            { name: 'Christian Hip Hop' },
            { name: 'Conscious Hip Hop' },
            { name: 'Country-Rap' },
            { name: 'Grunk' },
            { name: 'Crunkcore' },
            { name: 'Cumbia Rap' },
            { name: 'Dirty South' },
            { name: 'Freestyle Rap' },
            { name: 'G-Funk' },
            { name: 'Gangsta Rap' },
            { name: 'Golden Age' },
            { name: 'Grime' },
            { name: 'Hardcore Rap' },
            { name: 'Hip-Hop' },
            { name: 'Hip Pop' },
            { name: 'Horrorcore' },
            { name: 'Hyphy' },
            { name: 'Industrial Hip Hop' },
            { name: 'Instrumental Hip Hop' },
            { name: 'Jazz Rap' },
            { name: 'Latin Rap' },
            { name: 'Low Bap' },
            { name: 'Lyrical Hip Hop' },
            { name: 'Merenrap' },
            { name: 'Motswako' },
            { name: 'Nerdcore' },
            { name: 'New Jack Swing' },
            { name: 'New School Hip Hop' },
            { name: 'Old School Rap' },
            { name: 'Rap' },
            { name: 'Trap' },
            { name: 'Turntablism' },
            { name: 'Underground Rap' },
            { name: 'West Coast Rap' },
            {
                name: 'East Coast',
                children: [
                    { name: 'Brick City Club' },
                    { name: 'Hardcore Hip Hop' },
                    { name: 'Mafioso Rap' },
                    { name: 'New Jersey Hip Hop' },
                ]
            },
            {
                name: 'Midwest Hip Hop',
                children: [
                    { name: 'Chicago Hip Hop' },
                    { name: 'Detroit Hip Hop' },
                    { name: 'Horrorcore' },
                    { name: 'St. Louis Hip Hop' },
                    { name: 'Twin Cities Hip Hop' },
                ]
            },
        ]
    },
    {
        name: 'Holiday',
        children: [
            { name: 'Chanukah' },
            { name: 'Christmas' },
            { name: 'Easter' },
            { name: 'Halloween' },
            { name: 'Thanksgiving' },
        ]
    },
    { name: 'Indie Pop' },
    {
        name: 'Industrial',
        children: [
            { name: 'Aggrotech' },
            { name: 'Coldwave' },
            { name: 'Cybergrind' },
            { name: 'Dark Electro' },
            { name: 'Death Industrial' },
            { name: 'Electro-Industrial' },
            { name: 'Industrial Rock' },
            { name: 'Witch House' },
            {
                name: 'Electronic Body Music',
                children: [
                    { name: 'Futurepop' }
                ]
            },
            {
                name: 'Industrial Metal',
                children: [
                    { name: 'Neue Deutsche Härte' }
                ]
            },
            {
                name: 'Noise',
                children: [
                    { name: 'Japanoise' },
                    { name: 'Power Electronics' },
                    { name: 'Power Noise' },
                ]
            }
        ]
    },
    {
        name: 'Inspirational',
        children: [
            { name: 'CCM' },
            { name: 'Christian Metal' },
            { name: 'Christian Pop' },
            { name: 'Christian Rap' },
            { name: 'Christian Rock' },
            { name: 'Classic Christian' },
            { name: 'Contemporary Gospel' },
            { name: 'Gospel' },
            { name: 'Praise & Worship' },
            { name: 'Qawwali' },
            { name: 'Southern Gospel' },
            { name: 'Traditional Gospel' },
        ]
    },
    {
        name: 'Instrumental',
        children: [
            { name: 'March' }
        ]
    },
    {
        name: 'J-Pop',
        children: [
            { name: 'J-Rock' },
            { name: 'J-Synth' },
            { name: 'J-Ska' },
            { name: 'J-Punk' },
        ]
    },
    {
        name: 'Jazz',
        children: [
            { name: 'Acid Jazz' },
            { name: 'Afro-Cuban Jazz' },
            { name: 'Avant-Garde Jazz' },
            { name: 'Bebop' },
            { name: 'Big Band' },
            { name: 'Blue Note' },
            { name: 'Cool Jazz' },
            { name: 'Dixieland' },
            { name: 'Fusion' },
            { name: 'Gypsy Jazz' },
            { name: 'Hard Bop' },
            { name: 'Latin Jazz' },
            { name: 'Mainstream Jazz' },
            { name: 'Ragtime' },
            { name: 'Smooth Jazz' },
            { name: 'Soul Jazz' },
            { name: 'Swing Jazz' },
        ]
    },
    { name: 'K-Pop' },
    { name: 'Karaoke' },
    { name: 'Kayokyoku' },
    {
        name: 'Latin',
        children: [
            { name: 'Alternativo & Rock Latino' },
            { name: 'Argentine Tango' },
            { name: 'Bachata' },
            { name: 'Baithak Gana' },
            { name: 'Baladas y Boleros' },
            { name: 'Bolero' },
            { name: 'Bossa Nova' },
            { name: 'Chicha' },
            { name: 'Criolla' },
            { name: 'Contemporary Latin' },
            { name: 'Cumbia' },
            { name: 'Flamenco' },
            { name: 'Huayno' },
            { name: 'Joropo' },
            { name: 'Latin Jazz' },
            { name: 'Mambo' },
            { name: 'Mariachi' },
            { name: 'Merengue Típico' },
            { name: 'Pop Latino' },
            { name: 'Portuguese Fado' },
            { name: 'Punta' },
            { name: 'Ranchera' },
            { name: 'Reggaeton y Hip-Hop' },
            { name: 'Regional Mexicano' },
            { name: 'Salsa y Tropical' },
            { name: 'Soca' },
            { name: 'Son' },
            { name: 'Tejano' },
            { name: 'Timba' },
            { name: 'Vallenato' },
            { name: 'Zouk' },
            {
                name: 'Brazilian',
                children: [
                    { name: 'Axé' },
                    { name: 'Bossa Nova' },
                    { name: 'Brazilian Rock' },
                    { name: 'Brega' },
                    { name: 'Choro' },
                    { name: 'Forró' },
                    { name: 'Frevo' },
                    { name: 'Funk Carioca' },
                    { name: 'Lambada' },
                    { name: 'Maracatu' },
                    { name: 'MPB' },
                    { name: 'Música Sertaneja' },
                    { name: 'Pagode' },
                    { name: 'Samba' },
                    { name: 'Samba Rock' },
                    { name: 'Tecnobrega' },
                    { name: 'Tropicalia' },
                ]
            }
        ]
    },
    {
        name: 'Metal',
        children: [
            { name: 'Heavy Metal' },
            { name: 'Speed Metal' },
            { name: 'Thrash Metal' },
            { name: 'Power Metal' },
            { name: 'Death Metal' },
            { name: 'Black Metal' },
            { name: 'Pagan Metal' },
            { name: 'Viking Metal' },
            { name: 'Folk Metal' },
            { name: 'Symphonic Metal' },
            { name: 'Gothic Metal' },
            { name: 'Glam Metal' },
            { name: 'Doom Metal' },
            { name: 'Groove Metal' },
            { name: 'Industrial Metal' },
            { name: 'Neoclassical Metal' },
            { name: 'Post Metal' },
            { name: 'Progressive Metal' },
            { name: 'Sludge' },
            { name: 'Djent' },
            { name: 'Nu Metal' },
            { name: 'Metalcore' },
            { name: 'Deathcore' },
        ]
    },
    {
        name: 'New Age',
        children: [
            { name: 'Environmental' },
            { name: 'Healing' },
            { name: 'Meditation' },
            { name: 'Nature' },
            { name: 'Relaxation' },
        ]
    },
    { name: 'Opera' },
    {
        name: 'Pop',
        children: [
            { name: 'Adult Contemporary' },
            { name: 'Arab Pop' },
            { name: 'Britpop' },
            { name: 'Bubblegum Pop' },
            { name: 'Christian Pop' },
            { name: 'Dance Pop' },
            { name: 'Dream Pop' },
            { name: 'Electro Pop' },
            { name: 'Jangle Pop' },
            { name: 'Latin Pop' },
            { name: 'Pop Rap' },
            { name: 'Pop Punk' },
            { name: 'Power Pop' },
            { name: 'Soft Rock' },
            { name: 'Synthpop' },
            { name: 'Teen Pop' },
        ]
    },
    {
        name: 'R&B/Soul',
        children: [
            { name: 'Contemporary R&B' },
            { name: 'Disco' },
            { name: 'Funk' },
            { name: 'Motown' },
            { name: 'Neo-Soul' },
            { name: 'Soul' },
            { name: 'Soul Blues' },
        ]
    },
    {
        name: 'Reggae',
        children: [
            { name: 'Dub' },
            { name: 'Roots Reggae' },
            { name: 'Reggae Fusion' },
            { name: 'Dancehall' },
            { name: 'Ska' },
            {
                name: 'Reggae en Español',
                children: [
                    { name: 'Spanish Reggae' },
                    { name: 'Reggae 110' },
                    { name: 'Romantic Flow' },
                ]
            }
        ]
    },
    {
        name: 'Rock',
        children: [
            { name: 'Alternative Rock' },
            { name: 'Art Rock' },
            { name: 'Blues-Rock' },
            { name: 'Glam Rock' },
            { name: 'Hard Rock' },
            { name: 'Indie Rock' },
            { name: 'Metal' },
            { name: 'Post-Punk' },
            { name: 'Post-Rock' },
            { name: 'Progressive Rock' },
            { name: 'Psychedelic Rock' },
            { name: 'Rock & Roll' },
            { name: 'Soft Rock' },
            { name: 'Southern Rock' },
            { name: 'Surf Rock' },
        ]
    },
    {
        name: 'Singer/Songwriter',
        children: [
            { name: 'Alternative Folk' },
            { name: 'Contemporary Folk' },
            { name: 'Contemporary Singer/Songwriter' },
            { name: 'Indie Folk' },
            { name: 'Folk-Rock' },
        ]
    },
    {
        name: 'Soundtrack',
        children: [
            { name: 'Movie Soundtrack' },
            { name: 'Musicals' },
            { name: 'Original Score' },
        ]
    },
    { name: 'Spoken Word' },
    {
        name: 'World',
        children: [
            {
                name: 'Africa',
                children: [
                    { name: 'Afro-Beat' },
                    { name: 'Afro-House' },
                    { name: 'Afro-Pop' },
                    { name: 'Kuduro' },
                ]
            },
            {
                name: 'Asia',
                children: [
                    { name: 'C-Pop' },
                    { name: 'J-Pop' },
                    { name: 'K-Pop' },
                ]
            },
            { name: 'Cajun' },
            { name: 'Calypso' },
            { name: 'Celtic' },
            { name: 'Polka' },
            { name: 'Soca' },
            { name: 'Worldbeat' },
        ]
    }
];

export const COMMON_GENRES = [
    'Trap', 'Reggaetón', 'Drill', 'Pop', 'Rock', 'Jazz', 'Salsa',
    'Bachata', 'Merengue', 'Corridos', 'EDM', 'Afrobeats', 'Lo-Fi', 'R&B'
];
