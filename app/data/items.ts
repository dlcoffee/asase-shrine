import { createLookup } from '~/utils/create-lookup'

import itemsJson from './items.json'

export type Day = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'

interface Recipe {
  [id: string]: Record<string, number>
}

interface SourceBase {
  name: string
  type: string
}

interface SourceSingle extends SourceBase {
  type: 'single'
}

export interface SourceDomain extends SourceBase {
  type: 'domain'
  days: Day[]
}

type Source = SourceSingle | SourceDomain

export interface Item {
  _id: string
  id: string
  name: string
  icon: string
  type: string
  source: Source[] | null
  rank: 1 | 2 | 3 | 4 | 5
  recipe: false | Recipe
}

// using `as` because each item is strictly typed when imported (Recipe is problematic)
// @ts-ignore
const itemsList = itemsJson as Item[]

export const items = createLookup(itemsList, '_id')
