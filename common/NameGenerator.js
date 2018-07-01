// Most name components from Gavin Free:
// http://roosterteeth.wikia.com/wiki/Let%27s_Play_Worms

const adjectives = [
  'Cuddling',
  'Dr',
  'Drippy',
  'Flappy',
  'Flippy',
  'Floppy',
  'Fluid',
  'Flung',
  'Fodgy',
  'Foggy',
  'Goopy',
  'Gubbly',
  'Jazzy',
  'Minty',
  'Miss',
  'Mongy',
  'Mr',
  'Mrs',
  'Overhanging',
  'Phungal',
  'Residual',
  'Slimy',
  'Sloppy',
  'Soggy',
  'Splunky',
  'Squodgy',
  'Terrible',
  'Wafty',
  'Wolly',
  'Wonky',
  'Wumpy',
];

const names = [
  'Aroma',
  'Bedge',
  'Belding',
  'Bidge',
  'Biff',
  'Bint',
  'Bobby',
  'Bodge',
  'Bondar',
  'Budmar',
  'Clemble',
  'Crumpet',
  'Dibwibble',
  'Div',
  'Dollop',
  'Drillboids',
  'Dunbar',
  'Dunker',
  'Dust',
  'Faff',
  'Fedge',
  'Fidge',
  'Fip',
  'Fleck',
  'Fleg',
  'Flemberbridge',
  'Fod',
  'Fog',
  'Foip',
  'Fudd',
  'Fuglorn',
  'Funker',
  'Funt',
  'Gob',
  'Goggler',
  'Gondola',
  'Goop',
  'Gorp',
  'Gubbler',
  'Gunkhaus',
  'Gurkle',
  'Heimer',
  'Hinge',
  'Kreft',
  'Monger',
  'Mungmeiser',
  'Munkberry',
  'Munkhelm',
  'Murphy',
  'Noggler',
  'Offlebunker',
  'Pheonix',
  'Phump',
  'Piddington',
  'Piff',
  'Pleb',
  'Plunge',
  'Polyp',
  'Quaddle',
  'Quelch',
  'Quiff',
  'Sklog',
  'Slurp',
  'Spaff',
  'Splunt',
  'Sprangle',
  'Spudge',
  'Spuff',
  'Sput',
  'Squelch',
  'Squodge',
  'Stalagtite',
  'Vapor',
  'Wedge',
  'Wibbler',
  'Wob',
  'Wobbler',
  'Woggler',
  'Wong',
  'Wonk',
  'Wump',
  'Wunkle',
];

const ADJECTIVE_CHANCE = 0.25;
const DOUBLE_CHANCE = 0.4;

function selectFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateName() {
  let res = '';

  if(Math.random() < ADJECTIVE_CHANCE) {
    res += selectFromArray(adjectives) + ' ';
  }

  res += selectFromArray(names);

  if(Math.random() < DOUBLE_CHANCE) {
    res += ' ' + selectFromArray(names);
  }

  return res;
}