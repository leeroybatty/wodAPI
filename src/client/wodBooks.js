export const vampireDarkAges20thCore ='vampire: dark ages 20th anniversary core';
export const vampire20thCore = 'vampire: the masquerade 20th anniversary core';
export const mindsEyeVampire = 'mind\'s eye theatre: vampire the masquerade';
export const ghoulsAndRevenants = 'ghouls and revenants';
export const loreOfTheBloodlines = 'lore of the bloodlines';
export const loreOfTheClans = 'lore of the clans';
export const trueBlackHand = 'The Black Hand: A Guide To The Tal\'Mahe\'Ra';
export const anarchsUnbound = 'anarchs unbound';

export const revisedClanbooks = {
  'assamite': 'Clanbook Assamite',
  'brujah': 'Clanbook Brujah',
  'followers of set': 'Clanbook Followers of Set',
  'gangrel': 'Clanbook Gangrel',
  'giovanni': 'Clanbook Giovanni',
  'lasombra': 'Clanbook Lasombra',
  'malkavian': 'Clanbook Malkavian',
  'nosferatu': 'Clanbook Nosferatu',
  'ravnos': 'Clanbook Ravnos',
  'toreador': 'Clanbook Toreador',
  'tremere': 'Clanbook Tremere',
  'tzimisce': 'Clanbook Tzimisce',
  'ventrue': 'Clanbook Ventrue'
};

export function getVampireBooks (
    year = 2025,
    all20thContent = true,
    allVampireContent = false
) {
  let  books = [vampire20thCore];
  
  if (year < 1500) {
    books.push(vampireDarkAges20thCore);  
    if (allVampireContent) {
       books = [...books, ...Object.values(vampireDarkAgesRevisedBooks)];
    }
  }

  if (all20thContent) {
    books.push(
        ghoulsAndRevenants,
        trueBlackHand,
        loreOfTheClans,
        loreOfTheBloodlines
    );
    if (year > 1450) {
      books.push(anarchsUnbound);
    }
  }

  if (allVampireContent) {
    books.push(
        mindsEyeVampire
    );
    books = [
    ...books,
    ...Object.values(revisedClanbooks)
    ];
  }
}

export const vampireDarkAgesRevisedBooks = {
  'transylvaniaByNight': 'Vampire Dark Ages: Transylvania By Night'
}

// export const mageBooks = [
//   'mage: the ascension 20th anniversary core',
//   'the book of secrets',

// ];

// export const sorcererBooks = [
//   'mage 20th anniversary: sorcerer',
//   'tome of rituals'
// ];

// export const companionBooks = [
//   'gods and monsters'
// ]

// export const werewolfBooks = [
//   'werewolf: the apocalypse 20th anniversary core'
// ];

// export const kinfolkBooks = [
//   'Kinfolk: A Breed Apart'
// ];

// export const possessedBooks = [
//   'book of the wyrm',
//   'Umbra: The Velvet Shadow'
// ];

// export const changelingBooks = [
//   'Changeling: the Dreaming 20th Anniversary Core'
// ];

// export const wraithBooks = [
//   'Wraith: the Oblivion 20th Anniversary Core'
// ];

// export const demonBooks = [
//   'Demon: the Fallen'
// ];

// export const hunterBooks = [
//   'Hunter: the Reckoning',
//   'hunters hunted ii'
// ];