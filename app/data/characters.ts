import { createLookup } from '~/utils/create-lookup'

import { items, type Item } from './items'

export interface Character {
  id: string
  name: string
  talent_materials: Item[]
  ascension_materials: Item[]
}

export const charactersList: Character[] = [
  {
    id: 'albedo',
    name: 'Albedo',
    talent_materials: [items.teachings_of_ballad],
    ascension_materials: [],
  },
  {
    id: 'alhaitham',
    name: 'Alhaitham',
    talent_materials: [items.teachings_of_ingenuity],
    ascension_materials: [],
  },
  {
    id: 'aloy',
    name: 'Aloy',
    talent_materials: [items.teachings_of_freedom],
    ascension_materials: [],
  },
  {
    id: 'amber',
    name: 'Amber',
    talent_materials: [items.teachings_of_freedom],
    ascension_materials: [],
  },
  {
    id: 'arataki_itto',
    name: 'Arataki Itto',
    talent_materials: [items.teachings_of_elegance],
    ascension_materials: [],
  },
  {
    id: 'barbara',
    name: 'Barbara',
    talent_materials: [items.teachings_of_freedom],
    ascension_materials: [],
  },
  {
    id: 'beidou',
    name: 'Beidou',
    talent_materials: [items.teachings_of_gold],
    ascension_materials: [],
  },
  {
    id: 'bennett',
    name: 'Bennett',
    talent_materials: [items.teachings_of_resistance],
    ascension_materials: [],
  },
  {
    id: 'candace',
    name: 'Candace',
    talent_materials: [items.teachings_of_admonition],
    ascension_materials: [],
  },
  {
    id: 'chongyun',
    name: 'Chongyun',
    talent_materials: [items.teachings_of_diligence],
    ascension_materials: [],
  },
  {
    id: 'collei',
    name: 'Collei',
    talent_materials: [items.teachings_of_praxis],
    ascension_materials: [],
  },
  {
    id: 'cyno',
    name: 'Cyno',
    talent_materials: [items.teachings_of_admonition],
    ascension_materials: [],
  },
  {
    id: 'diluc',
    name: 'Diluc',
    talent_materials: [items.teachings_of_resistance],
    ascension_materials: [],
  },
  {
    id: 'diona',
    name: 'Diona',
    talent_materials: [items.teachings_of_freedom],
    ascension_materials: [],
  },
  {
    id: 'dori',
    name: 'Dori',
    talent_materials: [items.teachings_of_ingenuity],
    ascension_materials: [],
  },
  {
    id: 'eula',
    name: 'Eula',
    talent_materials: [items.teachings_of_resistance],
    ascension_materials: [],
  },
  {
    id: 'faruzan',
    name: 'Faruzan',
    talent_materials: [items.teachings_of_admonition],
    ascension_materials: [],
  },
  {
    id: 'fischl',
    name: 'Fischl',
    talent_materials: [items.teachings_of_ballad],
    ascension_materials: [],
  },
  {
    id: 'ganyu',
    name: 'Ganyu',
    talent_materials: [items.teachings_of_diligence],
    ascension_materials: [],
  },
  {
    id: 'gorou',
    name: 'Gorou',
    talent_materials: [items.teachings_of_light],
    ascension_materials: [],
  },
  {
    id: 'hu_tao',
    name: 'Hu Tao',
    talent_materials: [items.teachings_of_diligence],
    ascension_materials: [],
  },
  {
    id: 'jean',
    name: 'Jean',
    talent_materials: [items.teachings_of_resistance],
    ascension_materials: [],
  },
  {
    id: 'kaedehara_kazuha',
    name: 'Kaedehara Kazuha',
    talent_materials: [items.teachings_of_diligence],
    ascension_materials: [],
  },
  {
    id: 'kaeya',
    name: 'Kaeya',
    talent_materials: [items.teachings_of_ballad],
    ascension_materials: [],
  },
  {
    id: 'kamisato_ayaka',
    name: 'Kamisato Ayaka',
    talent_materials: [items.teachings_of_elegance],
    ascension_materials: [],
  },
  {
    id: 'kamisato_ayato',
    name: 'Kamisato Ayato',
    talent_materials: [items.teachings_of_elegance],
    ascension_materials: [],
  },
  {
    id: 'keqing',
    name: 'Keqing',
    talent_materials: [items.teachings_of_prosperity, items.ring_of_boreas],
    ascension_materials: [
      items.vajrada_amethyst_fragment,
      items.lightning_prism,
      items.cor_lapis,
      items.whopperflower_nectar,
    ],
  },
  {
    id: 'klee',
    name: 'Klee',
    talent_materials: [items.teachings_of_freedom],
    ascension_materials: [],
  },
  {
    id: 'kujou_sara',
    name: 'Kujou Sara',
    talent_materials: [items.teachings_of_elegance],
    ascension_materials: [],
  },
  {
    id: 'kuki_shinobu',
    name: 'Kuki Shinobu',
    talent_materials: [items.teachings_of_elegance],
    ascension_materials: [],
  },
  {
    id: 'layla',
    name: 'Layla',
    talent_materials: [items.teachings_of_ingenuity],
    ascension_materials: [],
  },
  {
    id: 'lisa',
    name: 'Lisa',
    talent_materials: [items.teachings_of_ballad],
    ascension_materials: [],
  },
  {
    id: 'mona',
    name: 'Mona',
    talent_materials: [items.teachings_of_resistance],
    ascension_materials: [],
  },
  {
    id: 'nahida',
    name: 'Nahida',
    talent_materials: [items.teachings_of_ingenuity],
    ascension_materials: [],
  },
  {
    id: 'nilou',
    name: 'Nilou',
    talent_materials: [items.teachings_of_praxis],
    ascension_materials: [],
  },
  {
    id: 'ningguang',
    name: 'Ningguang',
    talent_materials: [items.teachings_of_prosperity],
    ascension_materials: [],
  },
  {
    id: 'noelle',
    name: 'Noelle',
    talent_materials: [items.teachings_of_resistance],
    ascension_materials: [],
  },
  {
    id: 'qiqi',
    name: 'Qiqi',
    talent_materials: [items.teachings_of_prosperity],
    ascension_materials: [],
  },
  {
    id: 'raiden_shogun',
    name: 'Raiden Shogun',
    talent_materials: [items.teachings_of_light],
    ascension_materials: [],
  },
  {
    id: 'razor',
    name: 'Razor',
    talent_materials: [items.teachings_of_resistance],
    ascension_materials: [],
  },
  {
    id: 'rosaria',
    name: 'Rosaria',
    talent_materials: [items.teachings_of_ballad],
    ascension_materials: [],
  },
  {
    id: 'sangonomiya_kokomi',
    name: 'Sangonomiya Kokomi',
    talent_materials: [items.teachings_of_transience],
    ascension_materials: [],
  },
  {
    id: 'sayu',
    name: 'Sayu',
    talent_materials: [items.teachings_of_light],
    ascension_materials: [],
  },
  {
    id: 'shenhe',
    name: 'Shenhe',
    talent_materials: [items.teachings_of_prosperity],
    ascension_materials: [],
  },
  {
    id: 'shikanoin_heizou',
    name: 'Shikanoin Heizou',
    talent_materials: [items.teachings_of_transience],
    ascension_materials: [],
  },
  {
    id: 'sucrose',
    name: 'Sucrose',
    talent_materials: [items.teachings_of_freedom],
    ascension_materials: [],
  },
  {
    id: 'tartaglia',
    name: 'Tartaglia',
    talent_materials: [items.teachings_of_freedom],
    ascension_materials: [],
  },
  {
    id: 'thoma',
    name: 'Thoma',
    talent_materials: [items.teachings_of_transience],
    ascension_materials: [],
  },
  {
    id: 'tighnari',
    name: 'Tighnari',
    talent_materials: [items.teachings_of_admonition],
    ascension_materials: [],
  },
  {
    id: 'traveler_anemo',
    name: 'Traveler (Anemo)',
    talent_materials: [items.teachings_of_freedom, items.teachings_of_ballad],
    ascension_materials: [],
  },
  {
    id: 'traveler_geo',
    name: 'Traveler (Geo)',
    talent_materials: [
      items.teachings_of_prosperity,
      items.teachings_of_diligence,
      items.teachings_of_gold,
    ],
    ascension_materials: [],
  },
  {
    id: 'traveler_electro',
    name: 'Traveler (Electro)',
    talent_materials: [
      items.teachings_of_transience,
      items.teachings_of_elegance,
      items.teachings_of_light,
    ],
    ascension_materials: [],
  },
  {
    id: 'traveler_dendro',
    name: 'Traveler (Dendro)',
    talent_materials: [
      items.teachings_of_admonition,
      items.teachings_of_ingenuity,
      items.teachings_of_praxis,
    ],
    ascension_materials: [],
  },
  {
    id: 'venti',
    name: 'Venti',
    talent_materials: [items.teachings_of_ballad],
    ascension_materials: [],
  },
  {
    id: 'wanderer',
    name: 'Wanderer',
    talent_materials: [items.teachings_of_praxis],
    ascension_materials: [],
  },
  {
    id: 'xiangling',
    name: 'Xiangling',
    talent_materials: [items.teachings_of_diligence],
    ascension_materials: [],
  },
  {
    id: 'xiao',
    name: 'Xiao',
    talent_materials: [items.teachings_of_prosperity],
    ascension_materials: [],
  },
  {
    id: 'xingqiu',
    name: 'Xingqiu',
    talent_materials: [items.teachings_of_gold],
    ascension_materials: [],
  },
  {
    id: 'xinyan',
    name: 'Xinyan',
    talent_materials: [items.teachings_of_gold],
    ascension_materials: [],
  },
  {
    id: 'yae_miko',
    name: 'Yae Miko',
    talent_materials: [items.teachings_of_light],
    ascension_materials: [],
  },
  {
    id: 'yanfei',
    name: 'Yanfei',
    talent_materials: [items.teachings_of_gold],
    ascension_materials: [],
  },
  {
    id: 'yaoyao',
    name: 'Yaoyao',
    talent_materials: [items.teachings_of_diligence],
    ascension_materials: [],
  },
  {
    id: 'yelan',
    name: 'Yelan',
    talent_materials: [items.teachings_of_prosperity],
    ascension_materials: [],
  },
  {
    id: 'yoimiya',
    name: 'Yoimiya',
    talent_materials: [items.teachings_of_transience],
    ascension_materials: [],
  },
  {
    id: 'yun_jin',
    name: 'Yun Jin',
    talent_materials: [items.teachings_of_diligence],
    ascension_materials: [],
  },
  {
    id: 'zhongli',
    name: 'Zhongli',
    talent_materials: [items.teachings_of_gold],
    ascension_materials: [],
  },
]

export const characters = createLookup(charactersList, 'id')
