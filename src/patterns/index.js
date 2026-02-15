import { genMandala } from './mandala.js';
import { genFloral } from './floral.js';
import { genGeometric } from './geometric.js';
import { genZentangle } from './zentangle.js';
import { genOcean } from './ocean.js';
import { genElephant } from './elephant.js';
import { genButterfly } from './butterfly.js';
import { genCelestial } from './celestial.js';
import { genGarden } from './garden.js';
import { genMosaic } from './mosaic.js';
import { genKente } from './kente.js';
import { genSashiko } from './sashiko.js';
import { genPaisley } from './paisley.js';

export { PAT_NAMES } from '../state.js';

export const generators = [
  genMandala,
  genFloral,
  genGeometric,
  genZentangle,
  genOcean,
  genElephant,
  genButterfly,
  genCelestial,
  genGarden,
  genMosaic,
  genKente,
  genSashiko,
  genPaisley,
];
