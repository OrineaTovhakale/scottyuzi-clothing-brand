// src/utils/vestProduct.js
// Never 2Fly 2Pray Vest — shared product payload + colour galleries
import { asset } from './assets';

export const VEST_COLOURS = [
  'White and black text',
  'White and red text',
  'White and blue text',
  'White and purple text',
  'Black and white text',
  'Black and lime text',
];

export const VEST_IMAGES_BY_COLOUR = {
  'White and black text': [
    asset('vests/never2fly2pray/white-black/front.png'),
    asset('vests/never2fly2pray/white-black/back.png'),
    asset('vests/never2fly2pray/white-black/detail1.png'),
    asset('vests/never2fly2pray/white-black/detail2.png'),
  ],
  'White and red text': [
    asset('vests/never2fly2pray/white-red/front.png'),
    asset('vests/never2fly2pray/white-red/back.png'),
    asset('vests/never2fly2pray/white-red/detail1.png'),
    asset('vests/never2fly2pray/white-red/detail2.png'),
  ],
  'White and blue text': [
    asset('vests/never2fly2pray/white-blue/front.png'),
    asset('vests/never2fly2pray/white-blue/back.png'),
    asset('vests/never2fly2pray/white-blue/detail1.png'),
    asset('vests/never2fly2pray/white-blue/detail2.png'),
  ],
  'White and purple text': [
    asset('vests/never2fly2pray/white-purple/front.png'),
    asset('vests/never2fly2pray/white-purple/back.png'),
    asset('vests/never2fly2pray/white-purple/detail1.png'),
    asset('vests/never2fly2pray/white-purple/detail2.png'),
  ],
  'Black and white text': [
    asset('vests/never2fly2pray/black-white/front.png'),
    asset('vests/never2fly2pray/black-white/back.png'),
    asset('vests/never2fly2pray/black-white/detail1.png'),
    asset('vests/never2fly2pray/black-white/detail2.png'),
  ],
  'Black and lime text': [
    asset('vests/never2fly2pray/black-lime/front.png'),
    asset('vests/never2fly2pray/black-lime/back.png'),
    asset('vests/never2fly2pray/black-lime/detail1.png'),
    asset('vests/never2fly2pray/black-lime/detail2.png'),
  ],
};

export const vestHover = asset('vests/never2fly2pray/hover.png');
export const vestHero = asset('vests/never2fly2pray/hero.png');

/** Default colour = White and black text (first in VEST_COLOURS) */
export const VEST_PRODUCT = {
  name: 'Never 2Fly 2Pray Vest',
  image: VEST_IMAGES_BY_COLOUR['White and black text'][0],
  hoverImage: vestHover,
  price: 500,
  isNew: true,
  hasColourOptions: true,
  colourOptions: VEST_COLOURS,
  imagesByColour: VEST_IMAGES_BY_COLOUR,
  images: VEST_IMAGES_BY_COLOUR['White and black text'].slice(1),
};
