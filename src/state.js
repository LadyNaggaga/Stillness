export const SZ = 800;
export const SK = '#2a2a3a';
export const SW = 1.5;

export const THEMES = {
  Default: [
    '#e07a5f','#3d405b','#81b29a','#f2cc8f','#264653',
    '#2a9d8f','#e9c46a','#f4a261','#e76f51','#606c38',
    '#283618','#dda15e','#bc6c25','#6d6875','#b5838d',
    '#e5989b','#ffb4a2','#6930c3','#5390d9','#48bfe3',
    '#72efdd','#c77dff','#f72585','#4cc9f0','#7209b7'
  ],
  'Spring Bloom': [
    '#f4a7bb','#fbc4d4','#ffe0ec','#ffd6e0','#f9e4c8',
    '#fff1c1','#e8f5b0','#c8e6a2','#8ecf6d','#5bb450',
    '#a0d8b3','#6ec5a8','#b5ead7','#81d4c2','#a3d9e8',
    '#7ec8e3','#b6ccfe','#c3b1e1','#d5a6e6','#e6c2f7',
    '#f2d0e0','#ffb6b9','#f7c6a3','#eadbc8','#c9e4de'
  ],
  'Autumn Warmth': [
    '#8b2500','#a63c06','#c45d1a','#d4753e','#e8915a',
    '#c97b3a','#d4a24e','#e5b75f','#daa520','#b8860b',
    '#8b6914','#6b4423','#5c3317','#7a4e2d','#a0522d',
    '#8b4513','#704214','#5e3a1a','#556b2f','#6b7339',
    '#8a7f4b','#9b8e5e','#c9b37f','#705044','#3e2723'
  ],
  'Winter Frost': [
    '#e8f0fe','#d4e4f7','#b0cde8','#89b4d6','#6699cc',
    '#4a7fb5','#3a6591','#2b4c6f','#1b3a5c','#0f2744',
    '#708090','#8f9baa','#b0bec5','#cfd8dc','#e0e5ec',
    '#a8b8c8','#c5cad3','#7e9aac','#5c8a9e','#467f8b',
    '#3d8b8a','#6eb5b0','#96cbc7','#bfdce0','#d5c6e0'
  ]
};

export let PALETTE = [...THEMES.Default];

export function setPalette(colors) {
  PALETTE.length = 0;
  colors.forEach(function (c) { PALETTE.push(c); });
}

export const PAT_NAMES = [
  'Mandala','Floral','Geometric','Zentangle','Ocean','Elephant',
  'Butterfly','Celestial','Garden','Mosaic','Kente','Sashiko','Paisley'
];

export const SND_NAMES = ['Chimes','Wind','Birds','Ocean'];

export const S = {
  tool: 'fill',
  color: null,
  theme: 'Default',
  gc1: null, gc2: null,
  gradType: 'linear',
  brushSz: 5, brushOp: 1,
  pat: 0, snd: 0, vol: 0.5,
  panning: false, panPt: null,
  gradItem: null, gradPt: null,
  brushPath: null,
  gcSel: 1,
};
