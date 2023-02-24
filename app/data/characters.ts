import { createLookup } from '~/utils/create-lookup'

import { type Item } from './items'

export interface Character {
  id: string
  name: string
  talent_materials: Item[]
  ascension_materials: Item[]
}

export const charactersList: Character[] = [
  {
    id: 'raiden',
    name: 'Raiden',
    talent_materials: [],
    ascension_materials: [],
  },
]

export const characters = createLookup(charactersList, 'id')
